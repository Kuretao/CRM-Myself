import { randomBytes, randomUUID } from "node:crypto";
import argon2 from "argon2";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { env } from "../config.js";
import { toJson } from "../lib/json.js";
import { requireUser } from "../plugins/auth.js";
import { prisma } from "../prisma.js";

const credentials = z.object({
  email: z
    .string()
    .email()
    .max(254)
    .transform((value) => value.trim().toLowerCase()),
  password: z.string().min(8).max(128),
});
const registerBody = credentials.extend({
  name: z.string().trim().min(2).max(80),
});
const refreshBody = z.object({ refreshToken: z.string().min(40) });
const profileBody = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  destination: z.string().trim().max(120).optional(),
  program: z.string().trim().max(160).optional(),
  startDate: z.string().datetime().nullable().optional(),
  currencyRate: z.coerce.number().positive().max(1000).optional(),
  themeName: z.enum(["light", "dark"]).optional(),
});

async function issueSession(app: FastifyInstance, userId: string) {
  const sessionId = randomUUID();
  const secret = randomBytes(48).toString("base64url");
  const refreshToken = `${sessionId}.${secret}`;
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_DAYS * 86_400_000);
  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      refreshTokenHash: await argon2.hash(secret),
      expiresAt,
    },
  });
  return {
    accessToken: await app.jwt.sign(
      { sub: userId },
      { expiresIn: env.JWT_EXPIRES_IN },
    ),
    refreshToken,
    refreshExpiresAt: expiresAt.toISOString(),
  };
}

async function findRefreshSession(refreshToken: string) {
  const separator = refreshToken.indexOf(".");
  if (separator < 1) return null;
  const id = refreshToken.slice(0, separator);
  const secret = refreshToken.slice(separator + 1);
  const session = await prisma.session.findUnique({ where: { id } });
  if (!session || session.expiresAt <= new Date()) return null;
  return (await argon2.verify(session.refreshTokenHash, secret))
    ? session
    : null;
}

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/register",
    { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const input = registerBody.parse(request.body);
      const exists = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (exists)
        return reply.code(409).send({ message: "Email is already registered" });
      const user = await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          passwordHash: await argon2.hash(input.password),
        },
      });
      return reply
        .code(201)
        .send({ user: toJson(user), ...(await issueSession(app, user.id)) });
    },
  );

  app.post(
    "/login",
    { config: { rateLimit: { max: 8, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const input = credentials.parse(request.body);
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user || !(await argon2.verify(user.passwordHash, input.password))) {
        return reply.code(401).send({ message: "Invalid email or password" });
      }
      return { user: toJson(user), ...(await issueSession(app, user.id)) };
    },
  );

  app.post("/refresh", async (request, reply) => {
    const { refreshToken } = refreshBody.parse(request.body);
    const session = await findRefreshSession(refreshToken);
    if (!session)
      return reply
        .code(401)
        .send({ message: "Invalid or expired refresh token" });
    await prisma.session.delete({ where: { id: session.id } });
    return issueSession(app, session.userId);
  });

  app.post("/logout", { preHandler: requireUser }, async (request, reply) => {
    const parsed = refreshBody.safeParse(request.body);
    if (parsed.success) {
      const session = await findRefreshSession(parsed.data.refreshToken);
      if (session?.userId === request.userId) {
        await prisma.session.delete({ where: { id: session.id } });
      }
    }
    return reply.code(204).send();
  });

  app.get("/me", { preHandler: requireUser }, async (request) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: request.userId },
    });
    return { user: toJson(user) };
  });

  app.patch("/me", { preHandler: requireUser }, async (request) => {
    const input = profileBody.parse(request.body);
    const user = await prisma.user.update({
      where: { id: request.userId },
      data: {
        ...input,
        startDate:
          input.startDate === undefined
            ? undefined
            : input.startDate
              ? new Date(input.startDate)
              : null,
      },
    });
    return { user: toJson(user) };
  });
}
