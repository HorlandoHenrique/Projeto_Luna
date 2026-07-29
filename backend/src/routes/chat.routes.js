import { z } from "zod";
import { prisma } from "../db.js";
import { evaluateSafety } from "../services/safety.service.js";
import { captureMemories, getMemoryContext } from "../services/memory.service.js";
import { ensureRelationship, updateRelationshipFromMessage } from "../services/relationship.service.js";
import { generateLunaReply } from "../services/ai.service.js";

const messageSchema = z.object({
  text: z.string().trim().min(1).max(2000)
});

async function getConversation(userId) {
  const existing = await prisma.conversation.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" }
  });

  if (existing) {
    return existing;
  }

  return prisma.conversation.create({
    data: { userId }
  });
}

export default async function chatRoutes(fastify) {
  fastify.get("/history", { preHandler: [fastify.authenticate] }, async (request) => {
    const userId = request.user.sub;
    const conversation = await getConversation(userId);
    const [messages, memories, relationship] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: "asc" },
        take: 80
      }),
      getMemoryContext(prisma, userId),
      ensureRelationship(prisma, userId)
    ]);

    return {
      conversationId: conversation.id,
      messages,
      memories,
      relationship
    };
  });

  fastify.post("/message", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const parsed = messageSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({ error: "invalid_message", details: parsed.error.flatten() });
    }

    const userId = request.user.sub;
    const text = parsed.data.text;
    const [user, conversation] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      getConversation(userId)
    ]);

    const safety = evaluateSafety(text);
    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "USER",
        content: text,
        metadata: JSON.stringify({ safety })
      }
    });

    if (safety.type !== "none") {
      await prisma.safetyEvent.create({
        data: {
          userId,
          type: safety.type,
          severity: safety.severity,
          content: text.slice(0, 500)
        }
      });
    }

    const [capturedMemories, relationship] = await Promise.all([
      captureMemories(prisma, userId, text, userMessage.id),
      updateRelationshipFromMessage(prisma, userId, text, safety)
    ]);

    const [memories, recentMessages] = await Promise.all([
      getMemoryContext(prisma, userId),
      prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: "desc" },
        take: 12
      })
    ]);

    const lunaReply = await generateLunaReply({
      user,
      memories,
      relationship,
      recentMessages: recentMessages.reverse(),
      userText: text,
      safety
    });

    const lunaMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "LUNA",
        content: lunaReply.text,
        metadata: JSON.stringify({
          tone: lunaReply.tone,
          usedAi: lunaReply.usedAi,
          provider: lunaReply.provider,
          model: lunaReply.model,
          responseId: lunaReply.responseId,
          safety,
          aiError: lunaReply.error
        })
      }
    });

    return {
      reply: lunaMessage.content,
      message: lunaMessage,
      relationship,
      capturedMemories,
      safety,
      usedAi: lunaReply.usedAi,
      provider: lunaReply.provider,
      model: lunaReply.model
    };
  });
}
