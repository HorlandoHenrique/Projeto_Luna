function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR");
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function getRelationshipSummary(state) {
  if (state.intimacy >= 55 && state.affinity >= 55 && state.comfort >= 45) {
    return "A relacao ja tem historico, confianca e uma proximidade clara, mas ainda deve evoluir sem pressa.";
  }

  if (state.intimacy >= 25 || state.affinity >= 25 || state.comfort >= 25) {
    return "A Luna ja reconhece alguns padroes do usuario e a conversa esta ficando mais natural.";
  }

  return "A relacao ainda esta no comeco, com intimidade e conforto sendo construidos aos poucos.";
}

export async function ensureRelationship(prisma, userId) {
  return prisma.relationshipState.upsert({
    where: { userId },
    update: {},
    create: { userId }
  });
}

export async function updateRelationshipFromMessage(prisma, userId, text, safety) {
  const current = await ensureRelationship(prisma, userId);
  const normalizedText = normalize(text);
  const isPositive = includesAny(normalizedText, ["gosto de voce", "gosto de vc", "saudade", "obrigado", "obrigada", "confio"]);
  const isVulnerable = includesAny(normalizedText, ["tenho medo", "me sinto", "nunca contei", "segredo", "triste", "chateado", "chateada"]);
  const isCasual = includesAny(normalizedText, ["kk", "rs", "mds", "vc", "pq", "o q"]);
  const isConflict = safety.type === "violence" || includesAny(normalizedText, ["raiva de voce", "raiva de vc", "briguei", "discuti"]);

  const next = {
    intimacy: clamp(current.intimacy + 1 + (isVulnerable ? 3 : 0)),
    affinity: clamp(current.affinity + 1 + (isPositive ? 3 : 0) - (isConflict ? 2 : 0)),
    comfort: clamp(current.comfort + 1 + (isCasual ? 2 : 0)),
    trust: clamp(current.trust + (isVulnerable ? 2 : 1)),
    conflict: clamp(current.conflict + (isConflict ? 5 : -1)),
    romanticOpenness: clamp(current.romanticOpenness + (isPositive && current.intimacy > 30 ? 1 : 0)),
    messageCount: current.messageCount + 1,
    lastInteractionAt: new Date()
  };

  next.summary = getRelationshipSummary(next);

  return prisma.relationshipState.update({
    where: { userId },
    data: next
  });
}
