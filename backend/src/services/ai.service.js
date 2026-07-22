import OpenAI from "openai";
import { config } from "../config.js";
import { buildLunaSystemPrompt } from "../luna/prompt.js";
import { getSafetyReply } from "./safety.service.js";
import { styleLunaReply } from "./luna-style.service.js";

function getFallbackReply({ userText, relationship, safety }) {
  const safetyReply = getSafetyReply(safety);

  if (safetyReply) {
    return safetyReply;
  }

  if (relationship?.intimacy > 35 && /triste|chatead|medo|ansiedade/iu.test(userText)) {
    return {
      text: "Eu li com calma. Parece pesado pra vc, ne? Me conta so a parte que estiver menos dificil agora",
      tone: "serious"
    };
  }

  const replies = [
    { text: "Entendi. Me fala um pouco mais disso", tone: "normal" },
    { text: "O q mais ficou na sua cabeca depois disso?", tone: "normal" },
    { text: "Faz sentido. Fiquei curiosa com essa parte", tone: "normal" },
    { text: "Mds, isso parece pequeno, mas diz bastante", tone: "normal" },
    { text: "Me conta do seu jeito, nao precisa arrumar tudo antes", tone: "normal" }
  ];

  return replies[Math.floor(Math.random() * replies.length)];
}

export async function generateLunaReply({ user, memories, relationship, recentMessages, userText, safety }) {
  const fallback = getFallbackReply({ userText, relationship, safety });

  if (!config.openaiApiKey) {
    return {
      text: styleLunaReply(fallback.text, fallback.tone),
      tone: fallback.tone,
      usedAi: false
    };
  }

  try {
    const client = new OpenAI({
      apiKey: config.openaiApiKey
    });

    const input = [
      {
        role: "system",
        content: buildLunaSystemPrompt({ user, memories, relationship })
      },
      ...recentMessages.map((message) => ({
        role: message.role === "USER" ? "user" : "assistant",
        content: message.content
      })),
      {
        role: "user",
        content: userText
      }
    ];

    const response = await client.responses.create({
      model: config.openaiModel,
      input,
      max_output_tokens: 180
    });

    const text = response.output_text?.trim();

    return {
      text: styleLunaReply(text || fallback.text, fallback.tone),
      tone: "normal",
      usedAi: Boolean(text)
    };
  } catch (error) {
    return {
      text: styleLunaReply(fallback.text, fallback.tone),
      tone: fallback.tone,
      usedAi: false,
      error: error.message
    };
  }
}
