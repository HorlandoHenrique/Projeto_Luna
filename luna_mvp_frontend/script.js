const composer = document.querySelector("#composer");
const input = document.querySelector("#message-input");
const chatWindow = document.querySelector("#chat-window");
const countEl = document.querySelector("#message-count");

let remainingMessages = 20;

const lunaReplies = [
  "entendi...",
  "me conta melhor isso",
  "tô pensando aqui no que você falou",
  "kkk gostei dessa",
  "hmm... não sei se concordo totalmente",
  "tá, isso foi meio fofo",
  "vou lembrar disso 🙂"
];

function addBubble(text, type) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${type}`;
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function fakeLunaReply() {
  const reply = lunaReplies[Math.floor(Math.random() * lunaReplies.length)];
  setTimeout(() => addBubble(reply, "luna"), 550);
}

composer.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text || remainingMessages <= 0) return;

  addBubble(text, "user");
  input.value = "";

  remainingMessages -= 1;
  countEl.textContent = remainingMessages;

  if (remainingMessages === 0) {
    setTimeout(() => addBubble("acabaram suas mensagens de hoje... talvez a assinatura resolva isso depois", "luna"), 500);
    return;
  }

  fakeLunaReply();
});
