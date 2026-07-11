import { env } from "./config.js";
import { prisma } from "./prisma.js";
import { buildApp } from "./app.js";

const app = await buildApp();
const close = async () => {
  await app.close();
  await prisma.$disconnect();
};
process.on("SIGINT", close);
process.on("SIGTERM", close);
await app.listen({ host: env.HOST, port: env.PORT });
