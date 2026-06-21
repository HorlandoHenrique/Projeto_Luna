const composer = document.querySelector("#composer");
const input = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
const messageList = document.querySelector("#message-list");
const countEl = document.querySelector("#message-count");
const usageCard = document.querySelector("#usage-card");
const usageHint = document.querySelector("#usage-hint");

const DAILY_MESSAGE_LIMIT = 20;
const LOW_MESSAGE_THRESHOLD = 5;

let remainingMessages = DAILY_MESSAGE_LIMIT;

const lunaReplies = [
  "entendi... me conta melhor.",
  "fiquei pensando no que você disse.",
  "isso tem um jeito bem seu.",
  "não sei se entendi tudo, mas quero ouvir.",
  "pode continuar. estou aqui.",
  "hmm, acho que eu faria uma pergunta sobre isso.",
  "gostei dessa parte."
];

function addMessage(text, author) {
  const message = document.createElement("div");
  message.className = `message-bubble message-bubble--${author}`;
  message.textContent = text;
  messageList.appendChild(message);
  messageList.scrollTop = messageList.scrollHeight;
}

function updateUsageState() {
  countEl.textContent = remainingMessages;
  usageCard.classList.toggle("is-low", remainingMessages > 0 && remainingMessages <= LOW_MESSAGE_THRESHOLD);
  usageCard.classList.toggle("is-empty", remainingMessages === 0);

  if (remainingMessages === 0) {
    usageHint.textContent = "As mensagens acabaram nesta simulação. A assinatura ainda não está ativa.";
    input.disabled = true;
    sendButton.disabled = true;
    return;
  }

  if (remainingMessages <= LOW_MESSAGE_THRESHOLD) {
    usageHint.textContent = "Você está chegando ao limite simulado do beta.";
    return;
  }

  usageHint.textContent = "Este limite é apenas uma simulação do MVP.";
}

function replyAsLuna() {
  const reply = lunaReplies[Math.floor(Math.random() * lunaReplies.length)];
  window.setTimeout(() => addMessage(reply, "luna"), 520);
}

composer.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text || remainingMessages <= 0) {
    return;
  }

  addMessage(text, "user");
  input.value = "";
  remainingMessages -= 1;
  updateUsageState();

  if (remainingMessages === 0) {
    window.setTimeout(() => {
      addMessage("acabaram as mensagens de hoje por aqui. amanhã a gente continua.", "luna");
    }, 520);
    return;
  }

  replyAsLuna();
});

updateUsageState();
