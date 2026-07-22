const memoryPatterns = [
  {
    type: "identity",
    label: "nome_preferido",
    priority: 3,
    confidence: 0.86,
    regex: /\b(?:meu nome e|meu nome é|me chamo|pode me chamar de)\s+([^,.!?]{2,60})/iu,
    content(match) {
      return `O usuario prefere ser chamado de ${match[1].trim()}`;
    }
  },
  {
    type: "preference",
    label: "gosto",
    priority: 2,
    confidence: 0.72,
    regex: /\b(?:eu gosto de|gosto de|curto)\s+([^.!?]{2,120})/iu,
    content(match) {
      return `O usuario gosta de ${match[1].trim()}`;
    }
  },
  {
    type: "preference",
    label: "nao_gosto",
    priority: 2,
    confidence: 0.72,
    regex: /\b(?:nao gosto de|não gosto de|odeio)\s+([^.!?]{2,120})/iu,
    content(match) {
      return `O usuario nao gosta de ${match[1].trim()}`;
    }
  },
  {
    type: "date",
    label: "aniversario",
    priority: 3,
    confidence: 0.78,
    regex: /\b(?:meu aniversario e|meu aniversário é|faco aniversario|faço aniversário|nasci)\s+(?:em|no dia)?\s*([^.!?]{2,80})/iu,
    content(match) {
      return `Aniversario ou data importante do usuario: ${match[1].trim()}`;
    }
  },
  {
    type: "person",
    label: "pessoa_importante",
    priority: 3,
    confidence: 0.68,
    regex: /\b(minha mae|minha mãe|meu pai|minha namorada|meu namorado|minha esposa|meu marido|minha amiga|meu amigo)\s+([^.!?]{0,120})/iu,
    content(match) {
      return `Pessoa importante mencionada: ${match[1].trim()} ${match[2].trim()}`.trim();
    }
  },
  {
    type: "routine",
    label: "rotina",
    priority: 2,
    confidence: 0.62,
    regex: /\b(?:eu trabalho com|trabalho com|eu estudo|estudo|minha faculdade|meu trabalho)\s+([^.!?]{2,120})/iu,
    content(match) {
      return `Rotina do usuario: ${match[0].trim()}`;
    }
  }
];

function normalizeContent(content) {
  return content.replace(/\s+/g, " ").trim().slice(0, 280);
}

export async function captureMemories(prisma, userId, text, sourceMessageId) {
  const captured = [];

  for (const pattern of memoryPatterns) {
    const match = text.match(pattern.regex);

    if (!match) {
      continue;
    }

    const content = normalizeContent(pattern.content(match));

    if (!content) {
      continue;
    }

    const memory = await prisma.memory.upsert({
      where: {
        userId_type_label: {
          userId,
          type: pattern.type,
          label: pattern.label
        }
      },
      update: {
        content,
        priority: pattern.priority,
        confidence: pattern.confidence,
        sourceMessageId
      },
      create: {
        userId,
        type: pattern.type,
        label: pattern.label,
        content,
        priority: pattern.priority,
        confidence: pattern.confidence,
        sourceMessageId
      }
    });

    captured.push(memory);
  }

  return captured;
}

export async function getMemoryContext(prisma, userId) {
  return prisma.memory.findMany({
    where: { userId },
    orderBy: [
      { priority: "desc" },
      { updatedAt: "desc" }
    ],
    take: 12
  });
}
