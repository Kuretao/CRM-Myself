import { Decimal } from "@prisma/client/runtime/library";

export function toJson<T>(value: T): T {
  if (value instanceof Decimal) return Number(value) as T;
  if (value instanceof Date) return value.toISOString() as T;
  if (Array.isArray(value)) return value.map(toJson) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        toJson(item),
      ]),
    ) as T;
  }
  return value;
}
