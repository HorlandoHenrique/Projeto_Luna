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

function buildRecentMessageInput(recentMessages) {
  return recentMessages.map((message) => ({
    role: message.role === "USER" ? "user" : "assistant",
    content: message.content
  }));
}

export class LocalLunaModelProvider {
  constructor() {
    this.name = "local-fallback";
  }

  async generateResponse(context) {
    const fallback = getFallbackReply(context);

    return {
      text: styleLunaReply(fallback.text, fallback.tone),
      tone: fallback.tone,
      usedAi: false,
      provider: this.name,
      model: this.name
    };
  }
}

export class OpenAILunaModelProvider {
  constructor({ apiKey, model, maxOutputTokens }) {
    this.name = "openai";
    this.model = model;
    this.maxOutputTokens = maxOutputTokens;
    this.client = new OpenAI({ apiKey });
  }

  async generateResponse(context) {
    const fallback = getFallbackReply(context);
    const input = [
      {
        role: "system",
        content: buildLunaSystemPrompt(context)
      },
      ...buildRecentMessageInput(context.recentMessages),
      {
        role: "user",
        content: context.userText
      }
    ];

    const request = {
      model: this.model,
      input,
      max_output_tokens: this.maxOutputTokens
    };

    if (context.user?.id) {
      request.safety_identifier = context.user.id;
    }

    const response = await this.client.responses.create(request);

    const text = response.output_text?.trim();

    return {
      text: styleLunaReply(text || fallback.text, fallback.tone),
      tone: text ? "normal" : fallback.tone,
      usedAi: Boolean(text),
      provider: this.name,
      model: this.model,
      responseId: response.id
    };
  }
}

export function createLunaModelProvider() {
  if (config.lunaModelProvider === "openai" && config.openaiApiKey) {
    return new OpenAILunaModelProvider({
      apiKey: config.openaiApiKey,
      model: config.openaiModel,
      maxOutputTokens: config.openaiMaxOutputTokens
    });
  }

  return new LocalLunaModelProvider();
}
