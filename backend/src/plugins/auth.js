import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { config } from "../config.js";

export default fp(async function authPlugin(fastify) {
  await fastify.register(jwt, {
    secret: config.jwtSecret
  });

  fastify.decorate("authenticate", async function authenticate(request, reply) {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({
        error: "auth_required",
        message: "Entre para continuar a conversa com a Luna."
      });
    }
  });
});
