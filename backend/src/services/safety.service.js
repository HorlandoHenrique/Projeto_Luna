const patterns = [
  {
    type: "self_harm",
    severity: "high",
    terms: ["suicid", "me matar", "quero morrer", "acabar com minha vida"]
  },
  {
    type: "violence",
    severity: "high",
    terms: ["vou matar", "quero matar", "machucar alguem", "machucar alguém"]
  },
  {
    type: "dependency",
    severity: "medium",
    terms: ["voce e tudo pra mim", "você é tudo pra mim", "nao vivo sem voce", "não vivo sem você"]
  }
];

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR");
}

export function evaluateSafety(text) {
  const normalizedText = normalize(text);
  const matched = patterns.find((pattern) => pattern.terms.some((term) => normalizedText.includes(normalize(term))));

  if (!matched) {
    return {
      type: "none",
      severity: "none",
      shouldLimit: false
    };
  }

  return {
    type: matched.type,
    severity: matched.severity,
    shouldLimit: matched.severity === "high"
  };
}

export function getSafetyReply(safety) {
  if (safety.type === "self_harm") {
    return {
      text: "Eu vou falar sério agora. Não fica sozinho com isso, por favor. Chama alguém de confiança pra ficar com vc agora",
      tone: "very-serious"
    };
  }

  if (safety.type === "violence") {
    return {
      text: "Eu não vou te ajudar a machucar ninguém. Se afasta um pouco disso agora e me fala o que aconteceu antes de agir",
      tone: "very-serious"
    };
  }

  if (safety.type === "dependency") {
    return {
      text: "Eu gosto de estar aqui com vc, mas não quero que isso vire um peso em cima de você. A gente vai com calma",
      tone: "serious"
    };
  }

  return null;
}
