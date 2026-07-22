import { z } from "zod";
import { prisma } from "../db.js";

const waitlistSchema = z.object({
  email: z.string().trim().email().max(120),
  displayName: z.string().trim().max(80).optional(),
  source: z.string().trim().max(40).optional().default("site")
});

const subscriptionIntentSchema = z.object({
  plan: z.enum(["monthly", "yearly"]),
  paymentMethod: z.enum(["card", "pix"])
});

export default async function waitlistRoutes(fastify) {
  fastify.post("/", async (request, reply) => {
    const parsed = waitlistSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({ error: "invalid_waitlist", details: parsed.error.flatten() });
    }

    const entry = await prisma.waitlistEntry.create({
      data: {
        email: parsed.data.email.toLocaleLowerCase("pt-BR"),
        displayName: parsed.data.displayName,
        source: parsed.data.source
      }
    });

    return {
      ok: true,
      entry
    };
  });

  fastify.post("/subscription-intent", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const parsed = subscriptionIntentSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({ error: "invalid_subscription_intent", details: parsed.error.flatten() });
    }

    const intent = await prisma.subscriptionIntent.create({
      data: {
        userId: request.user.sub,
        plan: parsed.data.plan,
        paymentMethod: parsed.data.paymentMethod
      }
    });

    return {
      ok: true,
      intent
    };
  });
}
