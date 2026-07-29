import { createLunaModelProvider, LocalLunaModelProvider } from "./model-provider.service.js";

function buildRuntimeContext() {
  const now = new Date();

  return {
    isoTime: now.toISOString(),
    locale: "pt-BR",
    timezone: "America/Sao_Paulo"
  };
}

export async function generateLunaReply({ user, memories, relationship, recentMessages, userText, safety }) {
  const context = {
    user,
    memories,
    relationship,
    recentMessages,
    userText,
    safety,
    runtime: buildRuntimeContext()
  };
  const provider = createLunaModelProvider();

  try {
    return await provider.generateResponse(context);
  } catch (error) {
    const fallbackProvider = new LocalLunaModelProvider();
    const fallbackReply = await fallbackProvider.generateResponse(context);

    return {
      ...fallbackReply,
      error: error.message
    };
  }
}
