import type { FastifyInstance, FastifyRequest } from "fastify";

export async function requireUser(request: FastifyRequest) {
  const payload = await request.jwtVerify<{ sub: string }>();
  if (!payload?.sub) throw new Error("Invalid access token");
  request.userId = payload.sub;
}

export async function authPlugin(app: FastifyInstance) {
  app.decorateRequest("userId", "");
}
