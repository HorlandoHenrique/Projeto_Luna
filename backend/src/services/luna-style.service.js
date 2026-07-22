const finalPeriodTones = new Set(["dry", "sarcastic", "angry", "upset", "argument"]);
const preciseTypingTones = new Set(["serious", "very-serious", "angry", "upset", "argument"]);
const learnedLowercaseWords = new Set(["vc", "ce", "pq", "n", "mds", "rs"]);

function applyCasualAbbreviations(text) {
  return text
    .replace(/(^|[^\p{L}])o\s+qu[eê](?=$|[^\p{L}])/giu, "$1o q")
    .replace(/(^|[^\p{L}])por\s+qu[eê](?=$|[^\p{L}])/giu, "$1pq")
    .replace(/(^|[^\p{L}])porqu[eê]s?(?=$|[^\p{L}])/giu, "$1pq");
}

function preserveLearnedCasualAbbreviations(text) {
  return text
    .replace(/(^|[.!?]\s+)O q(?=$|[\s,?!])/g, "$1o q")
    .replace(/(^|[.!?]\s+)Pq(?=$|[\s,?!])/g, "$1pq");
}

function capitalizeSentenceStarts(text, allowKeyboardSlips = true) {
  let shouldCapitalize = true;

  return text.replace(/\p{L}+|[.!?]+/gu, (token) => {
    if (/^[.!?]+$/.test(token)) {
      shouldCapitalize = true;
      return token;
    }

    if (!shouldCapitalize) {
      return token;
    }

    shouldCapitalize = false;
    const lowerToken = token.toLocaleLowerCase("pt-BR");

    if (allowKeyboardSlips && learnedLowercaseWords.has(lowerToken) && Math.random() < 0.08) {
      return lowerToken;
    }

    return `${token.charAt(0).toLocaleUpperCase("pt-BR")}${token.slice(1)}`;
  });
}

function removeCasualFinalPeriod(text, tone) {
  const trimmedText = text.trim();

  if (finalPeriodTones.has(tone) || !trimmedText.endsWith(".") || trimmedText.endsWith("...")) {
    return trimmedText;
  }

  return trimmedText.slice(0, -1).trimEnd();
}

function splitLongReply(text) {
  const trimmedText = text.trim();

  if (trimmedText.length <= 180) {
    return trimmedText;
  }

  return trimmedText
    .split(/(?<=[?!])\s+|(?<=,)\s+/u)
    .slice(0, 3)
    .join("\n")
    .trim();
}

export function styleLunaReply(text, tone = "normal") {
  const preciseTyping = preciseTypingTones.has(tone);
  const baseText = splitLongReply(text);
  const textWithVocabulary = preciseTyping ? baseText : applyCasualAbbreviations(baseText);
  const capitalizedText = capitalizeSentenceStarts(textWithVocabulary, !preciseTyping);
  const keyboardStyledText = preciseTyping ? capitalizedText : preserveLearnedCasualAbbreviations(capitalizedText);

  return removeCasualFinalPeriod(keyboardStyledText, tone);
}
