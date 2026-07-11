import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { toJson } from "../lib/json.js";
import { requireUser } from "../plugins/auth.js";
import { prisma } from "../prisma.js";

const idParams = z.object({ id: z.string().cuid() });
const date = z
  .string()
  .datetime()
  .transform((value) => new Date(value));
const optionalDate = z
  .string()
  .datetime()
  .transform((value) => new Date(value))
  .nullable()
  .optional();
const lowerEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values).transform((value) => value.toUpperCase());

const schemas = {
  accounts: z.object({
    title: z.string().trim().min(1).max(100),
    type: lowerEnum(["cash", "card", "savings", "debt"]),
    currency: z.enum(["RUB", "CNY", "USD"]),
    balance: z.coerce.number().finite(),
  }),
  categories: z.object({
    title: z.string().trim().min(1).max(80),
    kind: lowerEnum(["income", "expense", "task"]),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }),
  tasks: z.object({
    title: z.string().trim().min(1).max(240),
    due: optionalDate,
    time: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .nullable()
      .optional(),
    tag: z.string().trim().max(50).default("Личное"),
    description: z.string().trim().max(5000).nullable().optional(),
    priority: z.enum(["low", "medium", "high"]).nullable().optional(),
    status: lowerEnum(["todo", "in_progress", "done"]).default("TODO"),
  }),
  transactions: z.object({
    title: z.string().trim().min(1).max(180),
    amount: z.coerce.number().positive().finite(),
    type: lowerEnum(["income", "expense"]),
    category: z.string().trim().min(1).max(80),
    date,
    accountId: z.string().cuid().nullable().optional(),
    note: z.string().trim().max(1000).nullable().optional(),
    plannedItemId: z.string().cuid().nullable().optional(),
  }),
  plannedItems: z.object({
    title: z.string().trim().min(1).max(180),
    type: lowerEnum(["income", "expense"]),
    amountMin: z.coerce.number().min(0).finite(),
    amountMax: z.coerce.number().min(0).finite(),
    due: date,
    category: z.string().trim().min(1).max(80),
    stage: lowerEnum(["required", "reserve", "flexible"]),
    status: lowerEnum(["planned", "paid", "skipped"]).default("PLANNED"),
    note: z.string().trim().max(1000).nullable().optional(),
  }),
  documents: z.object({
    title: z.string().trim().min(1).max(180),
    category: lowerEnum(["travel", "study", "housing", "health", "finance"]),
    status: lowerEnum(["missing", "preparing", "ready", "expired"]).default(
      "PREPARING",
    ),
    expiresAt: optionalDate,
    contact: z.string().trim().max(160).nullable().optional(),
    location: z.string().trim().max(240).nullable().optional(),
    note: z.string().trim().max(2000).nullable().optional(),
  }),
} as const;

type ResourceName = keyof typeof schemas;
const delegates = {
  accounts: prisma.account,
  categories: prisma.category,
  tasks: prisma.task,
  transactions: prisma.transaction,
  plannedItems: prisma.plannedItem,
  documents: prisma.personalDocument,
} as const;
const orderBy: Record<ResourceName, Record<string, "asc" | "desc">> = {
  accounts: { createdAt: "asc" },
  categories: { title: "asc" },
  tasks: { updatedAt: "desc" },
  transactions: { date: "desc" },
  plannedItems: { due: "asc" },
  documents: { updatedAt: "desc" },
};

function presentation(resource: ResourceName, item: Record<string, unknown>) {
  const converted = toJson(item) as Record<string, unknown>;
  const enumFields: Partial<Record<ResourceName, string[]>> = {
    accounts: ["type"],
    categories: ["kind"],
    tasks: ["status"],
    transactions: ["type"],
    plannedItems: ["type", "stage", "status"],
    documents: ["category", "status"],
  };
  for (const field of enumFields[resource] || []) {
    if (typeof converted[field] === "string")
      converted[field] = (converted[field] as string).toLowerCase();
  }
  return converted;
}

async function owned(resource: ResourceName, userId: string, id: string) {
  const delegate = delegates[resource] as any;
  const item = await delegate.findFirst({ where: { id, userId } });
  if (!item) {
    const error = new Error("Resource not found");
    (error as Error & { statusCode: number }).statusCode = 404;
    throw error;
  }
  return item;
}

export async function resourceRoutes(app: FastifyInstance) {
  for (const resource of Object.keys(schemas) as ResourceName[]) {
    const schema = schemas[resource];
    const base = `/v1/${resource}`;
    app.get(base, { preHandler: requireUser }, async (request) => {
      const delegate = delegates[resource] as any;
      const rows = await delegate.findMany({
        where: { userId: request.userId },
        orderBy: orderBy[resource],
      });
      return {
        items: rows.map((row: Record<string, unknown>) =>
          presentation(resource, row),
        ),
      };
    });
    app.post(base, { preHandler: requireUser }, async (request, reply) => {
      const input = schema.parse(request.body);
      const delegate = delegates[resource] as any;
      const item = await delegate.create({
        data: { ...input, userId: request.userId },
      });
      return reply.code(201).send({ item: presentation(resource, item) });
    });
    app.patch(`${base}/:id`, { preHandler: requireUser }, async (request) => {
      const { id } = idParams.parse(request.params);
      await owned(resource, request.userId, id);
      const input = schema.partial().parse(request.body);
      const delegate = delegates[resource] as any;
      const item = await delegate.update({ where: { id }, data: input });
      return { item: presentation(resource, item) };
    });
    app.delete(
      `${base}/:id`,
      { preHandler: requireUser },
      async (request, reply) => {
        const { id } = idParams.parse(request.params);
        await owned(resource, request.userId, id);
        const delegate = delegates[resource] as any;
        await delegate.delete({ where: { id } });
        return reply.code(204).send();
      },
    );
  }
}
