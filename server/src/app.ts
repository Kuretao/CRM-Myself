import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { ZodError } from "zod";
import { corsOrigins, env } from "./config.js";
import { authPlugin } from "./plugins/auth.js";
import { prisma } from "./prisma.js";
import { authRoutes } from "./routes/auth.js";
import { resourceRoutes } from "./routes/resources.js";
import { workspaceRoutes } from "./routes/workspace.js";

export async function buildApp() {
  const app = Fastify({ logger: env.NODE_ENV !== "test" });
  await app.register(cors, {
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
  });
  await app.register(rateLimit, {
    global: true,
    max: 200,
    timeWindow: "1 minute",
  });
  await app.register(jwt, { secret: env.JWT_SECRET });
  await app.register(authPlugin);

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply
        .code(400)
        .send({ message: "Validation failed", issues: error.issues });
    }
    const status = (error as Error & { statusCode?: number }).statusCode || 500;
    if (status >= 500) app.log.error(error);
    const message = error instanceof Error ? error.message : "Request failed";
    return reply
      .code(status)
      .send({ message: status >= 500 ? "Internal server error" : message });
  });

  app.get("/health", async () => {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: "ok",
      service: "nova-ledger-api",
      time: new Date().toISOString(),
    };
  });
  await app.register(authRoutes, { prefix: "/v1/auth" });
  await app.register(resourceRoutes);
  await app.register(workspaceRoutes);
  return app;
}
