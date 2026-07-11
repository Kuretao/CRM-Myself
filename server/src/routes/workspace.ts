import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { toJson } from "../lib/json.js";
import { requireUser } from "../plugins/auth.js";
import { prisma } from "../prisma.js";

const chineseBody = z.object({
  completed: z.array(z.string().max(80)).max(2000),
  saved: z.array(z.string().max(80)).max(5000),
  mastered: z.array(z.string().max(80)).max(5000),
  reviewed: z.coerce.number().int().min(0).max(10_000_000),
});
const threadBody = z.object({ title: z.string().trim().min(1).max(160) });
const messageBody = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().trim().min(1).max(20_000),
});
const threadParams = z.object({ threadId: z.string().cuid() });

export async function workspaceRoutes(app: FastifyInstance) {
  app.get("/v1/workspace", { preHandler: requireUser }, async (request) => {
    const [
      user,
      accounts,
      categories,
      tasks,
      transactions,
      plannedItems,
      aiThreads,
      documents,
      chinese,
    ] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { id: request.userId } }),
      prisma.account.findMany({
        where: { userId: request.userId },
        orderBy: { createdAt: "asc" },
      }),
      prisma.category.findMany({
        where: { userId: request.userId },
        orderBy: { title: "asc" },
      }),
      prisma.task.findMany({
        where: { userId: request.userId },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.transaction.findMany({
        where: { userId: request.userId },
        orderBy: { date: "desc" },
      }),
      prisma.plannedItem.findMany({
        where: { userId: request.userId },
        orderBy: { due: "asc" },
      }),
      prisma.aiThread.findMany({
        where: { userId: request.userId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.personalDocument.findMany({
        where: { userId: request.userId },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.chineseProgress.findUnique({ where: { userId: request.userId } }),
    ]);
    return toJson({
      user,
      accounts,
      categories,
      tasks,
      transactions,
      plannedItems,
      aiThreads,
      documents,
      chinese: chinese || {
        completed: [],
        saved: [],
        mastered: [],
        reviewed: 0,
      },
    });
  });

  app.get(
    "/v1/chinese/progress",
    { preHandler: requireUser },
    async (request) => {
      const progress = await prisma.chineseProgress.findUnique({
        where: { userId: request.userId },
      });
      return {
        progress: toJson(
          progress || { completed: [], saved: [], mastered: [], reviewed: 0 },
        ),
      };
    },
  );
  app.put(
    "/v1/chinese/progress",
    { preHandler: requireUser },
    async (request) => {
      const input = chineseBody.parse(request.body);
      const progress = await prisma.chineseProgress.upsert({
        where: { userId: request.userId },
        create: { userId: request.userId, ...input },
        update: input,
      });
      return { progress: toJson(progress) };
    },
  );

  app.post(
    "/v1/ai/threads",
    { preHandler: requireUser },
    async (request, reply) => {
      const { title } = threadBody.parse(request.body);
      const thread = await prisma.aiThread.create({
        data: { title, userId: request.userId },
      });
      return reply.code(201).send({ thread: toJson(thread) });
    },
  );
  app.get(
    "/v1/ai/threads/:threadId",
    { preHandler: requireUser },
    async (request, reply) => {
      const { threadId } = threadParams.parse(request.params);
      const thread = await prisma.aiThread.findFirst({
        where: { id: threadId, userId: request.userId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
      if (!thread) return reply.code(404).send({ message: "Thread not found" });
      return { thread: toJson(thread) };
    },
  );
  app.post(
    "/v1/ai/threads/:threadId/messages",
    { preHandler: requireUser },
    async (request, reply) => {
      const { threadId } = threadParams.parse(request.params);
      const thread = await prisma.aiThread.findFirst({
        where: { id: threadId, userId: request.userId },
      });
      if (!thread) return reply.code(404).send({ message: "Thread not found" });
      const input = messageBody.parse(request.body);
      const message = await prisma.$transaction(async (tx) => {
        const created = await tx.aiMessage.create({
          data: { threadId, ...input },
        });
        await tx.aiThread.update({
          where: { id: threadId },
          data: { updatedAt: new Date() },
        });
        return created;
      });
      return reply.code(201).send({ message: toJson(message) });
    },
  );
}
