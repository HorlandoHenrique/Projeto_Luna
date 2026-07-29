const composer = document.querySelector("#composer");
const input = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
const messageList = document.querySelector("#message-list");
const lunaPresenceStatus = document.querySelector("#luna-presence-status");
const chatSuggestions = document.querySelector("#chat-suggestions");
const chatSuggestionButtons = document.querySelectorAll("[data-chat-suggestion]");
const countEl = document.querySelector("#message-count");
const usageCard = document.querySelector("#usage-card");
const usageHint = document.querySelector("#usage-hint");
const loginButton = document.querySelector("#login-button");
const loginPanel = document.querySelector("#login-panel");
const googleButton = document.querySelector("#google-signin-button");
const loginHint = document.querySelector("#login-hint");
const userChip = document.querySelector("#user-chip");
const userAvatar = document.querySelector("#user-avatar");
const userName = document.querySelector("#user-name");
const logoutButton = document.querySelector("#logout-button");
const accountTabs = document.querySelectorAll("[data-auth-mode]");
const authPanels = document.querySelectorAll("[data-auth-panel]");
const signupForm = document.querySelector("#signup-form");
const signinForm = document.querySelector("#signin-form");
const forgotPasswordButton = document.querySelector("#forgot-password-button");
const subscriptionOverlay = document.querySelector("#subscription-overlay");
const subscriptionClose = document.querySelector("#subscription-close");
const paymentTabs = document.querySelectorAll("[data-payment-method]");
const paymentPanels = document.querySelectorAll("[data-payment-panel]");
const planOptions = document.querySelectorAll(".plan-option");
const subscriptionSubmit = document.querySelector("#subscription-submit");
const subscriptionTerms = document.querySelector("#subscription-terms");
const paymentHint = document.querySelector("#payment-hint");
const cardPaymentForm = document.querySelector("#card-payment-form");
const pixPaymentForm = document.querySelector("#pix-payment-form");
const cardNumberInput = document.querySelector("#card-number");
const cardExpiryInput = document.querySelector("#card-expiry");
const cardCpfInput = document.querySelector("#card-cpf");
const pixCpfInput = document.querySelector("#pix-cpf");
const pixCode = document.querySelector("#pix-code");
const menuToggle = document.querySelector("#menu-toggle");
const userMenuOverlay = document.querySelector("#user-menu-overlay");
const userMenuClose = document.querySelector("#user-menu-close");
const userMenuTabs = document.querySelectorAll("[data-menu-tab]");
const userMenuPanels = document.querySelectorAll("[data-menu-panel]");
const menuProfilePhoto = document.querySelector("#menu-profile-photo");
const menuProfileName = document.querySelector("#menu-profile-name");
const menuProfileEmail = document.querySelector("#menu-profile-email");
const menuAccountStatus = document.querySelector("#menu-account-status");
const menuPlanStatus = document.querySelector("#menu-plan-status");
const menuMemoryStatus = document.querySelector("#menu-memory-status");
const menuPhotoStatus = document.querySelector("#menu-photo-status");
const profilePhotoInput = document.querySelector("#profile-photo-input");
const menuAccountLogin = document.querySelector("#menu-account-login");
const menuAccountPremium = document.querySelector("#menu-account-premium");
const menuConversationTime = document.querySelector("#menu-conversation-time");
const menuSessionMood = document.querySelector("#menu-session-mood");
const menuUserMessages = document.querySelector("#menu-user-messages");
const menuLunaMessages = document.querySelector("#menu-luna-messages");
const menuRemainingMessages = document.querySelector("#menu-remaining-messages");
const menuRelationshipInsight = document.querySelector("#menu-relationship-insight");
const supportStatus = document.querySelector(".support-status");
const supportStatusText = document.querySelector("#support-status-text");
const supportChat = document.querySelector("#support-chat");
const supportForm = document.querySelector("#support-form");
const supportInput = document.querySelector("#support-input");
const supportTopicButtons = document.querySelectorAll("[data-support-topic]");
const imageViewer = document.querySelector("#image-viewer");
const imageViewerImage = document.querySelector("#image-viewer-image");
const imageViewerClose = document.querySelector("#image-viewer-close");
const imageViewerTriggers = document.querySelectorAll("[data-viewer-src]");
const lunaCarousel = document.querySelector("#luna-carousel");
const lunaCarouselBackdrop = document.querySelector("#luna-carousel-backdrop");
const lunaCarouselSlides = document.querySelectorAll("[data-carousel-slide]");
const debugElements = document.querySelectorAll("[data-debug-only]");
const authEntryElements = document.querySelectorAll("[data-auth-entry]");

const DEBUG_UI = new URLSearchParams(window.location.search).get("debug") === "1" || window.localStorage.getItem("luna_debug_ui") === "true";
const DAILY_MESSAGE_LIMIT = DEBUG_UI ? 20 : Number.POSITIVE_INFINITY;
const LOW_MESSAGE_THRESHOLD = 5;
const COMPOSER_MAX_TEXTAREA_HEIGHT = 132;
const LUNA_CAROUSEL_AUTO_DELAY_MS = 8200;
const LUNA_CAROUSEL_ROTATION_MS = 780;
const LUNA_CAROUSEL_MAX_PHOTOS = 10;
const LUNA_TYPING_MIN_DELAY_MS = 900;
const LUNA_TYPING_MAX_DELAY_MS = 5400;
const LUNA_TYPING_DOT_INTERVAL_MS = 520;
const LUNA_READ_MIN_DELAY_MS = 900;
const LUNA_READ_MAX_DELAY_MS = 3800;
const LUNA_COMPREHENSION_MIN_DELAY_MS = 420;
const LUNA_COMPREHENSION_MAX_DELAY_MS = 1600;
const LUNA_LEARNED_WORD_SLIP_RATE = 0.08;
const LUNA_MANUAL_CORRECTION_SKIP_RATE = 0.02;
const AUTH_PROFILE_STORAGE_KEY = "luna_auth_profile";
const BACKEND_SESSION_STORAGE_KEY = "luna_backend_session";
const SITE_ACCOUNT_STORAGE_KEY = "luna_site_demo_account";
const SUBSCRIPTION_STORAGE_KEY = "luna_subscription_demo";
const LEGACY_GOOGLE_STORAGE_KEY = "luna_google_profile";
const PROFILE_PHOTO_STORAGE_KEY = "luna_profile_photo";
const MENU_SESSION_STARTED_STORAGE_KEY = "luna_menu_session_started_at";
const USER_MESSAGE_COUNT_STORAGE_KEY = "luna_user_message_count";
const LUNA_MESSAGE_COUNT_STORAGE_KEY = "luna_luna_message_count";
const GOOGLE_CLIENT_ID_PLACEHOLDER = "COLE_SEU_GOOGLE_CLIENT_ID_AQUI.apps.googleusercontent.com";
const LUNA_FINAL_PERIOD_TONES = new Set(["dry", "sarcastic", "angry", "upset", "argument"]);
const LUNA_PRECISE_TYPING_TONES = new Set(["serious", "very-serious", "angry", "upset", "argument"]);
const LUNA_LEARNED_LOWERCASE_WORDS = new Set(["vc", "ce", "pq", "n", "mds", "rs"]);

let remainingMessages = DAILY_MESSAGE_LIMIT;
let googleAuthInitialized = false;
let selectedPaymentMethod = "card";
let isLunaTyping = false;
let lunaTypingIndicator = null;
let lunaTypingDotTimer = null;
let backendConversationActive = false;
let imageViewerLastFocus = null;
let activeCarouselIndex = 0;
let lunaCarouselAutoTimer = null;
let lunaCarouselTransitionTimer = null;
let isLunaCarouselAnimating = false;
let latestRelationship = null;
let menuStatsTimer = null;
let lunaLastSeenAt = new Date();
let userMessageCount = Number(window.sessionStorage.getItem(USER_MESSAGE_COUNT_STORAGE_KEY) || 0);
let lunaMessageCount = Number(window.sessionStorage.getItem(LUNA_MESSAGE_COUNT_STORAGE_KEY) || 1);

const lunaReplies = [
  "entendi. me fala um pouco mais disso.",
  "eu gosto quando a conversa começa assim, sem pressa.",
  "faz sentido. fiquei curiosa com essa parte.",
  "acho que eu te perguntaria o que ficou depois disso.",
  "tô aqui lendo com calma.",
  "mds, isso parece pequeno, mas diz bastante.",
  "me conta do seu jeito. não precisa arrumar tudo antes.",
  "vc fala disso de um jeito que dá vontade de entender melhor.",
  "o que me pegou foi o jeito que vc falou isso.",
  "não sei por que, mas isso ficou na minha cabeça."
];

const lunaSeriousReplies = [
  {
    text: "Entendi. Vou falar com calma porque isso parece importante.",
    tone: "serious"
  },
  {
    text: "Eu não quero brincar com isso agora. Me explica direito o que aconteceu.",
    tone: "serious"
  },
  {
    text: "Tá. Vou prestar atenção no que você está me falando.",
    tone: "serious"
  }
];

const subscriptionPlans = {
  monthly: {
    label: "Mensal",
    price: "R$ 19,90"
  },
  yearly: {
    label: "Anual",
    price: "R$ 179,90"
  }
};

const supportReplies = {
  account: "Sobre conta: quando o acesso estiver disponível, ele deve servir para manter histórico, preferências e continuidade de forma segura.",
  subscription: "Sobre continuidade: qualquer plano pago só deve aparecer quando houver benefício real e uma forma segura de pagamento.",
  payment: "Sobre pagamento: se houver cobrança no futuro, ela precisa ser clara, segura e confirmada antes de qualquer liberação de recurso.",
  privacy: "Sobre privacidade: a Luna deve lembrar coisas importantes com controle e consentimento, sem virar memória perfeita.",
  luna: "Sobre a Luna: ela é a personagem central do produto. A tecnologia ajuda, mas a sensação precisa ser de conversa com alguém consistente.",
  human: "Vou marcar isso como algo que pode precisar de uma pessoa real. O suporte humano ainda será organizado fora deste atendimento inicial."
};

const humanSupportTerms = [
  "humano",
  "pessoa",
  "atendente",
  "cobrança",
  "cobranca",
  "estorno",
  "reembolso",
  "cancelar",
  "cancelamento",
  "erro grave",
  "não consigo entrar",
  "nao consigo entrar"
];

const messageStatusMeta = {
  sent: {
    icon: "✓",
    label: "enviada",
    title: "Apenas enviada"
  },
  delivered: {
    icon: "✓✓",
    label: "não vista",
    title: "Entregue, ainda não vista"
  },
  read: {
    icon: "✓✓",
    label: "vista",
    title: "Visualizada"
  },
  failed: {
    icon: "!",
    label: "não enviada",
    title: "Não enviada"
  }
};

function applyDebugUi() {
  document.documentElement.dataset.debugUi = String(DEBUG_UI);

  debugElements.forEach((element) => {
    element.hidden = !DEBUG_UI;
  });
}

function hasRealAuthSystem() {
  return Boolean(window.LunaApi);
}

function canShowAuthUi() {
  return DEBUG_UI || hasRealAuthSystem();
}

function applyPublicFeatureVisibility() {
  const authAvailable = canShowAuthUi();

  authEntryElements.forEach((element) => {
    element.hidden = !authAvailable;
  });

  if (!authAvailable) {
    loginPanel.hidden = true;
    loginButton.setAttribute("aria-expanded", "false");
    userChip.hidden = true;
  }
}

function persistInteractionCounts() {
  window.sessionStorage.setItem(USER_MESSAGE_COUNT_STORAGE_KEY, String(userMessageCount));
  window.sessionStorage.setItem(LUNA_MESSAGE_COUNT_STORAGE_KEY, String(lunaMessageCount));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function focusConversation() {
  const chatPanel = document.querySelector(".chat-panel");

  chatPanel?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start"
  });

  window.setTimeout(() => input.focus(), prefersReducedMotion() ? 0 : 180);
}

function updateSuggestionVisibility() {
  if (!chatSuggestions) {
    return;
  }

  chatSuggestions.hidden = Boolean(input.value.trim());
}

function scrollMessagesToBottom() {
  messageList.scrollTop = messageList.scrollHeight;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function formatMessageTime(date = new Date()) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function setLunaPresence(isOnline) {
  if (!DEBUG_UI || !lunaPresenceStatus) {
    return;
  }

  lunaPresenceStatus.classList.toggle("is-online", isOnline);
  lunaPresenceStatus.textContent = isOnline ? "online" : `visto por último às ${formatMessageTime(lunaLastSeenAt)}`;
}

function setLunaOnline() {
  setLunaPresence(true);
}

function setLunaLastSeen() {
  lunaLastSeenAt = new Date();
  setLunaPresence(false);
}

function updateLunaPresenceFromWindow() {
  if (document.hidden) {
    setLunaLastSeen();
    return;
  }

  setLunaOnline();
}

function getReadingDelay(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const calculatedDelay = 620 + text.length * 18 + words * 92;

  return Math.min(
    LUNA_READ_MAX_DELAY_MS,
    Math.max(LUNA_READ_MIN_DELAY_MS, calculatedDelay)
  );
}

function getComprehensionDelay(text = "") {
  const punctuationMarks = text.match(/[,.!?;:]/g)?.length || 0;
  const calculatedDelay = 340 + text.length * 8 + punctuationMarks * 120;

  return Math.min(
    LUNA_COMPREHENSION_MAX_DELAY_MS,
    Math.max(LUNA_COMPREHENSION_MIN_DELAY_MS, calculatedDelay)
  );
}

function updateMessageStatus(message, status) {
  if (!message || message.dataset.messageAuthor !== "user") {
    return;
  }

  const statusMeta = messageStatusMeta[status] || messageStatusMeta.sent;
  const statusElement = message.querySelector("[data-message-status]");
  const iconElement = statusElement?.querySelector(".message-status__icon");
  const labelElement = statusElement?.querySelector(".message-status__label");

  message.dataset.messageStatus = status;

  if (!statusElement || !iconElement || !labelElement) {
    return;
  }

  statusElement.title = statusMeta.title;
  statusElement.setAttribute("aria-label", statusMeta.title);
  iconElement.textContent = statusMeta.icon;
  labelElement.textContent = statusMeta.label;
}

function hydrateInitialMessageTimes() {
  document.querySelectorAll("[data-initial-message] .message-time").forEach((timeElement) => {
    const timestamp = new Date();
    timeElement.dateTime = timestamp.toISOString();
    timeElement.textContent = formatMessageTime(timestamp);
  });
}

function addMessage(text, author, options = {}) {
  const timestamp = options.timestamp || new Date();
  const message = document.createElement("div");
  message.className = `message-bubble message-bubble--${author}`;
  message.dataset.messageAuthor = author;

  const textElement = document.createElement("span");
  textElement.className = "message-bubble__text";
  textElement.textContent = text;

  const metaElement = document.createElement("span");
  metaElement.className = "message-meta";

  const timeElement = document.createElement("time");
  timeElement.className = "message-time";
  timeElement.dateTime = timestamp.toISOString();
  timeElement.textContent = formatMessageTime(timestamp);
  metaElement.appendChild(timeElement);

  if (author === "user" && DEBUG_UI) {
    const statusElement = document.createElement("span");
    statusElement.className = "message-status";
    statusElement.dataset.messageStatus = "";

    const iconElement = document.createElement("span");
    iconElement.className = "message-status__icon";
    iconElement.setAttribute("aria-hidden", "true");

    const labelElement = document.createElement("span");
    labelElement.className = "message-status__label";

    statusElement.append(iconElement, labelElement);
    metaElement.appendChild(statusElement);
  }

  message.append(textElement, metaElement);
  messageList.appendChild(message);

  if (author === "user") {
    userMessageCount += 1;

    if (DEBUG_UI) {
      updateMessageStatus(message, options.status || "sent");
    }
  }

  if (author === "luna") {
    lunaMessageCount += 1;
  }

  persistInteractionCounts();
  updateUserMenu();
  updateSuggestionVisibility();
  scrollMessagesToBottom();

  return message;
}

function shouldUsePreciseTyping(tone) {
  return LUNA_PRECISE_TYPING_TONES.has(tone);
}

function shouldKeepKeyboardSlip(lowerToken) {
  const keyboardLearnedWord = LUNA_LEARNED_LOWERCASE_WORDS.has(lowerToken);

  return (
    (keyboardLearnedWord && Math.random() < LUNA_LEARNED_WORD_SLIP_RATE) ||
    Math.random() < LUNA_MANUAL_CORRECTION_SKIP_RATE
  );
}

function getLunaReplyConfig(candidate) {
  if (typeof candidate === "string") {
    return {
      text: candidate,
      tone: "normal"
    };
  }

  return {
    text: candidate.text || "",
    tone: candidate.tone || "normal"
  };
}

function normalizeSearchText(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR");
}

function hasSeriousContext(text) {
  const normalizedText = normalizeSearchText(text);

  return [
    "serio",
    "seria",
    "triste",
    "chatead",
    "raiva",
    "brav",
    "briguei",
    "briga",
    "discuti",
    "discussao",
    "mago",
    "preocup",
    "ansiedade",
    "medo",
    "morreu",
    "morte",
    "doente",
    "hospital"
  ].some((keyword) => normalizedText.includes(keyword));
}

function chooseLunaReply(userText = "") {
  const replyPool = hasSeriousContext(userText) ? lunaSeriousReplies : lunaReplies;

  return replyPool[Math.floor(Math.random() * replyPool.length)];
}

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

    if (allowKeyboardSlips && shouldKeepKeyboardSlip(lowerToken)) {
      return lowerToken;
    }

    return `${token.charAt(0).toLocaleUpperCase("pt-BR")}${token.slice(1)}`;
  });
}

function removeCasualFinalPeriod(text, tone) {
  const trimmedText = text.trim();

  if (LUNA_FINAL_PERIOD_TONES.has(tone) || !trimmedText.endsWith(".") || trimmedText.endsWith("...")) {
    return trimmedText;
  }

  return trimmedText.slice(0, -1).trimEnd();
}

function normalizeLunaReply(candidate) {
  const replyConfig = getLunaReplyConfig(candidate);
  const preciseTyping = shouldUsePreciseTyping(replyConfig.tone);
  const baseText = replyConfig.text.trim();
  const textWithVocabulary = preciseTyping ? baseText : applyCasualAbbreviations(baseText);
  const capitalizedText = capitalizeSentenceStarts(textWithVocabulary, !preciseTyping);
  const keyboardStyledText = preciseTyping ? capitalizedText : preserveLearnedCasualAbbreviations(capitalizedText);

  return removeCasualFinalPeriod(keyboardStyledText, replyConfig.tone);
}

function updateComposerAvailability() {
  const isEmpty = remainingMessages === 0;
  input.disabled = isEmpty;
  sendButton.disabled = isEmpty || isLunaTyping;
}

function getTypingDelay(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const punctuationMarks = text.match(/[,.!?;:]/g)?.length || 0;
  const calculatedDelay = 680 + text.length * 34 + words * 58 + punctuationMarks * 120;

  return Math.min(
    LUNA_TYPING_MAX_DELAY_MS,
    Math.max(LUNA_TYPING_MIN_DELAY_MS, calculatedDelay)
  );
}

function setTypingIndicatorText(dotCount) {
  if (!lunaTypingIndicator) {
    return;
  }

  lunaTypingIndicator.textContent = `digitando${".".repeat(dotCount)}`;
}

function showLunaTypingIndicator() {
  if (!DEBUG_UI) {
    return;
  }

  let dotCount = 1;
  lunaTypingIndicator = document.createElement("div");
  lunaTypingIndicator.className = "message-bubble message-bubble--luna message-bubble--typing";
  lunaTypingIndicator.setAttribute("role", "status");
  lunaTypingIndicator.setAttribute("aria-label", "Luna está digitando");
  setTypingIndicatorText(dotCount);
  messageList.appendChild(lunaTypingIndicator);
  scrollMessagesToBottom();

  lunaTypingDotTimer = window.setInterval(() => {
    dotCount = dotCount === 3 ? 1 : dotCount + 1;
    setTypingIndicatorText(dotCount);
  }, LUNA_TYPING_DOT_INTERVAL_MS);
}

function hideLunaTypingIndicator() {
  if (lunaTypingDotTimer) {
    window.clearInterval(lunaTypingDotTimer);
    lunaTypingDotTimer = null;
  }

  if (lunaTypingIndicator) {
    lunaTypingIndicator.remove();
    lunaTypingIndicator = null;
  }
}

function resizeComposer() {
  const cssMaxHeight = Number.parseFloat(window.getComputedStyle(input).maxHeight);
  const maxHeight = Number.isFinite(cssMaxHeight) ? cssMaxHeight : COMPOSER_MAX_TEXTAREA_HEIGHT;

  input.style.maxHeight = `${maxHeight}px`;
  input.style.height = "auto";

  const shouldScroll = input.scrollHeight > maxHeight;
  const nextHeight = Math.min(input.scrollHeight, maxHeight);

  input.style.height = `${nextHeight}px`;
  input.style.overflowY = shouldScroll ? "auto" : "hidden";
  input.classList.toggle("is-scrollable", shouldScroll);
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function getDisplayName(profile) {
  return profile.given_name || profile.name || profile.displayName || "Usuário";
}

function getInitialAvatar(name) {
  const initial = getDisplayName({ name }).trim().charAt(0).toUpperCase() || "U";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="32" fill="#342622"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#f6e8dc" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700">${initial}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getDemoPasswordToken(email, password) {
  let hash = 2166136261;
  const value = `${email}:${password}`;

  // Apenas para simular o fluxo no frontend; o backend real deve substituir isso.
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

function getGoogleClientId() {
  return window.LUNA_AUTH_CONFIG?.googleClientId?.trim() || "";
}

function hasGoogleClientId() {
  const clientId = getGoogleClientId();
  return clientId && clientId !== GOOGLE_CLIENT_ID_PLACEHOLDER && clientId.endsWith(".apps.googleusercontent.com");
}

function setLoginHint(message, isWarning = false) {
  loginHint.textContent = message;
  loginHint.classList.toggle("is-warning", isWarning);
}

function setAuthMode(mode) {
  accountTabs.forEach((tab) => {
    const isActive = tab.dataset.authMode === mode;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  authPanels.forEach((panel) => {
    panel.hidden = panel.dataset.authPanel !== mode;
  });
}

function decodeJwtPayload(token) {
  const payload = token.split(".")[1];
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const json = decodeURIComponent(
    window
      .atob(padded)
      .split("")
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );

  return JSON.parse(json);
}

function renderSignedOutState() {
  loginButton.hidden = !canShowAuthUi();
  loginButton.setAttribute("aria-expanded", "false");
  loginPanel.hidden = true;
  userChip.hidden = true;
  userAvatar.src = "";
  updateUserMenu();
}

function renderSignedInState(profile) {
  if (!canShowAuthUi()) {
    renderSignedOutState();
    return;
  }

  const displayName = getDisplayName(profile);
  const profilePhoto = getProfilePhotoSrc(profile);

  loginButton.hidden = true;
  loginPanel.hidden = true;
  userChip.hidden = false;
  userName.textContent = displayName;
  userAvatar.src = profilePhoto;
  userAvatar.alt = profile.picture || getStoredProfilePhoto() ? `Foto de ${displayName}` : `Inicial de ${displayName}`;
  updateUserMenu();
}

function saveActiveProfile(profile) {
  window.sessionStorage.setItem(AUTH_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  renderSignedInState(profile);
}

function getProfileFromBackendUser(user) {
  return {
    source: user.authProvider || "backend",
    name: user.displayName,
    given_name: user.displayName?.split(" ")[0],
    email: user.email,
    picture: user.avatarUrl
  };
}

function saveBackendSession(session) {
  window.sessionStorage.setItem(BACKEND_SESSION_STORAGE_KEY, JSON.stringify(session));
  window.LunaApi?.setToken(session.token);
  saveActiveProfile(getProfileFromBackendUser(session.user));
}

function saveGoogleProfile(profile) {
  const safeProfile = {
    source: "google",
    name: profile.name,
    given_name: profile.given_name,
    email: profile.email,
    picture: profile.picture
  };

  saveActiveProfile(safeProfile);
}

function readSessionJson(key) {
  try {
    const stored = window.sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function loadStoredProfile() {
  if (!canShowAuthUi()) {
    return null;
  }

  const backendSession = loadBackendSession();

  if (backendSession?.user) {
    return getProfileFromBackendUser(backendSession.user);
  }

  return readSessionJson(AUTH_PROFILE_STORAGE_KEY) || readSessionJson(LEGACY_GOOGLE_STORAGE_KEY);
}

function loadBackendSession() {
  return readSessionJson(BACKEND_SESSION_STORAGE_KEY);
}

function loadSiteAccount() {
  if (!DEBUG_UI && !hasRealAuthSystem()) {
    return null;
  }

  return readSessionJson(SITE_ACCOUNT_STORAGE_KEY);
}

function loadSubscription() {
  if (!DEBUG_UI) {
    return null;
  }

  return readSessionJson(SUBSCRIPTION_STORAGE_KEY);
}

function getStoredProfilePhoto() {
  return window.sessionStorage.getItem(PROFILE_PHOTO_STORAGE_KEY) || "";
}

function getProfilePhotoSrc(profile) {
  const storedPhoto = getStoredProfilePhoto();

  if (storedPhoto) {
    return storedPhoto;
  }

  if (profile?.picture) {
    return profile.picture;
  }

  return getInitialAvatar(getDisplayName(profile || { name: "Usuário" }));
}

function getSessionStartedAt() {
  const stored = window.sessionStorage.getItem(MENU_SESSION_STARTED_STORAGE_KEY);

  if (stored) {
    return Number(stored);
  }

  const now = Date.now();
  window.sessionStorage.setItem(MENU_SESSION_STARTED_STORAGE_KEY, String(now));

  return now;
}

function formatConversationTime() {
  const elapsedMs = Math.max(0, Date.now() - getSessionStartedAt());
  const minutes = Math.floor(elapsedMs / 60000);

  if (minutes < 1) {
    return "agora";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
}

function clampStat(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getEstimatedRelationship() {
  const sent = userMessageCount;
  const hasProfile = Boolean(loadStoredProfile());
  const hasPhoto = Boolean(getStoredProfilePhoto());
  const hasSubscription = Boolean(loadSubscription());

  if (latestRelationship) {
    return {
      intimacy: clampStat(latestRelationship.intimacy ?? 0),
      affinity: clampStat(latestRelationship.affinity ?? 0),
      comfort: clampStat(latestRelationship.comfort ?? 0)
    };
  }

  return {
    intimacy: clampStat(sent * 5 + (hasProfile ? 6 : 0) + (hasPhoto ? 3 : 0)),
    affinity: clampStat(sent * 4 + (hasProfile ? 4 : 0) + (hasSubscription ? 8 : 0)),
    comfort: clampStat(sent * 4 + (hasPhoto ? 4 : 0))
  };
}

function getRelationshipInsight({ intimacy, affinity, comfort }) {
  const average = Math.round((intimacy + affinity + comfort) / 3);

  if (average >= 55) {
    return "A conversa já tem sinais de continuidade e mais liberdade entre vocês.";
  }

  if (average >= 28) {
    return "A Luna já começa a reconhecer seu ritmo, mas ainda está indo sem pressa.";
  }

  if (userMessageCount > 0) {
    return "O vínculo ainda é novo, mas já saiu do primeiro silêncio.";
  }

  return "A Luna ainda está te conhecendo aos poucos.";
}

function getSessionMood({ intimacy, affinity, comfort }) {
  if (comfort >= 45) {
    return "A conversa está ficando mais solta.";
  }

  if (affinity >= 35) {
    return "Tem uma curiosidade boa aparecendo.";
  }

  if (userMessageCount > 0) {
    return "Primeiros sinais de convivência.";
  }

  return "Conversa começando com calma.";
}

function updateUserMenu() {
  const profile = loadStoredProfile();
  const displayName = profile ? getDisplayName(profile) : "Usuário";
  const subscription = loadSubscription();
  const relationship = getEstimatedRelationship();
  const hasBackendContinuity = hasRealAuthSystem() && (backendConversationActive || loadBackendSession());

  menuProfilePhoto.src = getProfilePhotoSrc(profile);
  menuProfilePhoto.alt = profile ? `Foto de ${displayName}` : "Foto de perfil do usuário";
  menuProfileName.textContent = displayName;
  menuProfileEmail.textContent = profile?.email || "Perfil local para ajustar sua experiência neste dispositivo.";
  menuAccountStatus.textContent = profile ? "Conta ativa" : "Visitante";
  menuPlanStatus.textContent = subscription ? `${subscriptionPlans[subscription.plan]?.label || "Plano"} registrado` : "Sem conta ativa";
  menuMemoryStatus.textContent = hasBackendContinuity ? "Continuidade ativa" : "Sessão local";
  menuPhotoStatus.textContent = getStoredProfilePhoto() || profile?.picture ? "Foto enviada" : "Aguardando foto";
  menuConversationTime.textContent = formatConversationTime();
  menuSessionMood.textContent = getSessionMood(relationship);
  menuUserMessages.textContent = userMessageCount;
  menuLunaMessages.textContent = lunaMessageCount;
  menuRemainingMessages.textContent = remainingMessages;
  menuRelationshipInsight.textContent = getRelationshipInsight(relationship);
}

function refreshModalBodyState() {
  const hasOpenLayer = !subscriptionOverlay.hidden || !imageViewer.hidden || !userMenuOverlay.hidden;
  document.body.classList.toggle("is-modal-open", hasOpenLayer);
}

function setUserMenuTab(tabName) {
  userMenuTabs.forEach((tab) => {
    const isActive = tab.dataset.menuTab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  userMenuPanels.forEach((panel) => {
    panel.hidden = panel.dataset.menuPanel !== tabName;
    panel.classList.toggle("is-active", panel.dataset.menuPanel === tabName);
  });

  updateUserMenu();
}

function openUserMenu(tabName = "account") {
  userMenuOverlay.hidden = false;
  menuToggle.setAttribute("aria-expanded", "true");
  loginPanel.hidden = true;
  loginButton.setAttribute("aria-expanded", "false");
  setUserMenuTab(tabName);
  refreshModalBodyState();

  window.clearInterval(menuStatsTimer);
  menuStatsTimer = window.setInterval(updateUserMenu, 30000);
  userMenuClose.focus();
}

function closeUserMenu() {
  userMenuOverlay.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  window.clearInterval(menuStatsTimer);
  menuStatsTimer = null;
  refreshModalBodyState();
  menuToggle.focus();
}

function appendSupportMessage(text, author = "bot") {
  const bubble = document.createElement("div");
  bubble.className = `support-bubble support-bubble--${author}`;
  bubble.textContent = text;
  supportChat.appendChild(bubble);
  supportChat.scrollTop = supportChat.scrollHeight;
}

function getSupportReply(text) {
  const normalizedText = text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR");

  const needsHuman = humanSupportTerms.some((term) => normalizedText.includes(
    term
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLocaleLowerCase("pt-BR")
  ));

  if (needsHuman) {
    supportStatus.classList.add("is-escalated");
    supportStatusText.textContent = "Encaminhamento humano recomendado";
    return supportReplies.human;
  }

  supportStatus.classList.remove("is-escalated");
  supportStatusText.textContent = "Suporte inicial ativo";

  if (/pagamento|cart[aã]o|pix|cobrar|cobranca|cobrança/u.test(normalizedText)) {
    return supportReplies.payment;
  }

  if (/assinatura|premium|plano|mensal|anual/u.test(normalizedText)) {
    return supportReplies.subscription;
  }

  if (/privacidade|dados|memoria|memória|lembrar/u.test(normalizedText)) {
    return supportReplies.privacy;
  }

  if (/luna|personagem|ia|chat/u.test(normalizedText)) {
    return supportReplies.luna;
  }

  if (/conta|login|entrar|senha|cadastro/u.test(normalizedText)) {
    return supportReplies.account;
  }

  return "Entendi. Por enquanto eu consigo orientar sobre conta, acesso, pagamento futuro, privacidade e funcionamento da Luna.";
}

function sendSupportMessage(text) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return;
  }

  appendSupportMessage(trimmedText, "user");
  window.setTimeout(() => {
    appendSupportMessage(getSupportReply(trimmedText), "bot");
  }, 360);
}

function getSelectedPlan() {
  return document.querySelector("input[name='subscriptionPlan']:checked")?.value || "monthly";
}

function formatDigitGroups(value, groupSizes) {
  const digits = value.replace(/\D/g, "");
  const groups = [];
  let cursor = 0;

  groupSizes.forEach((size) => {
    const group = digits.slice(cursor, cursor + size);

    if (group) {
      groups.push(group);
    }

    cursor += size;
  });

  return groups.join(" ");
}

function formatCpf(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const first = digits.slice(0, 3);
  const second = digits.slice(3, 6);
  const third = digits.slice(6, 9);
  const last = digits.slice(9, 11);

  if (digits.length > 9) {
    return `${first}.${second}.${third}-${last}`;
  }

  if (digits.length > 6) {
    return `${first}.${second}.${third}`;
  }

  if (digits.length > 3) {
    return `${first}.${second}`;
  }

  return first;
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function setPaymentHint(message, status = "default") {
  paymentHint.textContent = message;
  paymentHint.classList.toggle("is-success", status === "success");
  paymentHint.classList.toggle("is-warning", status === "warning");
}

function setPaymentMethod(method) {
  selectedPaymentMethod = method;

  paymentTabs.forEach((tab) => {
    const isActive = tab.dataset.paymentMethod === method;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  paymentPanels.forEach((panel) => {
    panel.hidden = panel.dataset.paymentPanel !== method;
  });

  setPaymentHint(method === "card" ? "Preencha os dados para registrar interesse. Nenhuma cobrança será feita." : "O Pix abaixo é apenas uma prévia local. Nenhuma cobrança será feita.");
}

function updateSelectedPlan() {
  const selectedPlan = getSelectedPlan();
  const plan = subscriptionPlans[selectedPlan];

  planOptions.forEach((option) => {
    option.classList.toggle("is-selected", option.querySelector("input")?.value === selectedPlan);
  });

  pixCode.textContent = selectedPlan === "yearly" ? "LUNA.PIX.LOCAL.17990" : "LUNA.PIX.LOCAL.1990";
  subscriptionSubmit.textContent = `Registrar interesse ${plan.label.toLowerCase()}`;
}

function getActivePaymentForm() {
  return selectedPaymentMethod === "pix" ? pixPaymentForm : cardPaymentForm;
}

function openSubscriptionModal() {
  if (!DEBUG_UI) {
    return;
  }

  subscriptionOverlay.hidden = false;
  refreshModalBodyState();
  loginPanel.hidden = true;
  loginButton.setAttribute("aria-expanded", "false");
  updateSelectedPlan();
  prefillSubscriptionIdentity();
  setPaymentMethod(selectedPaymentMethod);
}

function closeSubscriptionModal() {
  subscriptionOverlay.hidden = true;
  refreshModalBodyState();
}

function openImageViewerFromSource(imageSrc, imageAlt, focusTarget) {
  if (!imageSrc) {
    return;
  }

  imageViewerLastFocus = focusTarget || null;
  imageViewerImage.src = imageSrc;
  imageViewerImage.alt = imageAlt || "Foto ampliada da Luna";
  imageViewer.hidden = false;
  refreshModalBodyState();
  imageViewerClose.focus();
}

function openImageViewer(trigger) {
  openImageViewerFromSource(trigger.dataset.viewerSrc, trigger.dataset.viewerAlt, trigger);
}

function closeImageViewer() {
  imageViewer.hidden = true;
  imageViewerImage.src = "";
  imageViewerImage.alt = "";
  refreshModalBodyState();

  if (imageViewerLastFocus) {
    imageViewerLastFocus.focus();
    imageViewerLastFocus = null;
  }
}

function getCarouselPosition(slideIndex) {
  const slideCount = lunaCarouselSlides.length;

  if (!slideCount) {
    return 0;
  }

  const forwardDistance = (slideIndex - activeCarouselIndex + slideCount) % slideCount;

  if (forwardDistance === 0) {
    return 0;
  }

  if (forwardDistance === 1) {
    return 1;
  }

  if (forwardDistance === 2) {
    return 2;
  }

  if (forwardDistance === slideCount - 1) {
    return -1;
  }

  if (forwardDistance === slideCount - 2) {
    return -2;
  }

  return forwardDistance <= slideCount / 2 ? 3 : -3;
}

function updateCarouselSlideState() {
  lunaCarouselSlides.forEach((slide, index) => {
    const position = getCarouselPosition(index);

    slide.classList.remove("is-active", "is-next", "is-prev", "is-far-next", "is-far-prev", "is-hidden");

    if (position === 0) {
      slide.classList.add("is-active");
      slide.setAttribute("aria-current", "true");
      slide.setAttribute("aria-label", "Ampliar foto atual da Luna");
      return;
    }

    slide.removeAttribute("aria-current");
    slide.setAttribute("aria-label", "Trazer esta foto para o centro");

    if (position === 1) {
      slide.classList.add("is-next");
      return;
    }

    if (position === -1) {
      slide.classList.add("is-prev");
      return;
    }

    if (position === 2) {
      slide.classList.add("is-far-next");
      return;
    }

    if (position === -2) {
      slide.classList.add("is-far-prev");
      return;
    }

    slide.classList.add("is-hidden");
  });

  const activeSlide = lunaCarouselSlides[activeCarouselIndex];
  const activeSrc = activeSlide?.dataset.carouselSrc;

  if (lunaCarouselBackdrop && activeSrc && lunaCarouselBackdrop.getAttribute("src") !== activeSrc) {
    lunaCarouselBackdrop.src = activeSrc;
  }
}

function setCarouselSlide(nextIndex) {
  const slideCount = Math.min(lunaCarouselSlides.length, LUNA_CAROUSEL_MAX_PHOTOS);

  if (!slideCount) {
    return;
  }

  activeCarouselIndex = (nextIndex + slideCount) % slideCount;
  isLunaCarouselAnimating = true;
  window.clearTimeout(lunaCarouselTransitionTimer);
  lunaCarouselTransitionTimer = window.setTimeout(() => {
    isLunaCarouselAnimating = false;
  }, LUNA_CAROUSEL_ROTATION_MS);

  updateCarouselSlideState();
}

function stopLunaCarouselAutoRotation() {
  window.clearInterval(lunaCarouselAutoTimer);
  lunaCarouselAutoTimer = null;
}

function startLunaCarouselAutoRotation() {
  const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  stopLunaCarouselAutoRotation();

  if (shouldReduceMotion || lunaCarouselSlides.length <= 1) {
    return;
  }

  lunaCarouselAutoTimer = window.setInterval(() => {
    if (document.hidden || !imageViewer.hidden || isLunaCarouselAnimating) {
      return;
    }

    setCarouselSlide(activeCarouselIndex + 1);
  }, LUNA_CAROUSEL_AUTO_DELAY_MS);
}

function restartLunaCarouselAutoRotation() {
  stopLunaCarouselAutoRotation();
  startLunaCarouselAutoRotation();
}

function handleCarouselSlideClick(event) {
  const slide = event.currentTarget;
  const slideIndex = Number(slide.dataset.carouselIndex);

  if (Number.isNaN(slideIndex)) {
    return;
  }

  if (slideIndex !== activeCarouselIndex) {
    setCarouselSlide(slideIndex);
    restartLunaCarouselAutoRotation();
    return;
  }

  if (isLunaCarouselAnimating) {
    return;
  }

  openImageViewerFromSource(slide.dataset.carouselSrc, slide.dataset.carouselAlt, slide);
  restartLunaCarouselAutoRotation();
}

function initializeLunaCarousel() {
  if (!lunaCarousel || !lunaCarouselSlides.length) {
    return;
  }

  updateCarouselSlideState();
  startLunaCarouselAutoRotation();

  lunaCarouselSlides.forEach((slide) => {
    slide.addEventListener("click", handleCarouselSlideClick);
  });

  lunaCarousel.addEventListener("mouseenter", stopLunaCarouselAutoRotation);
  lunaCarousel.addEventListener("mouseleave", startLunaCarouselAutoRotation);
  lunaCarousel.addEventListener("focusin", stopLunaCarouselAutoRotation);
  lunaCarousel.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!lunaCarousel.contains(document.activeElement)) {
        startLunaCarouselAutoRotation();
      }
    }, 0);
  });
}

function prefillSubscriptionIdentity() {
  const profile = loadStoredProfile();

  if (!profile) {
    return;
  }

  const displayName = getDisplayName(profile);
  const cardNameInput = document.querySelector("#card-name");
  const pixNameInput = document.querySelector("#pix-name");
  const pixEmailInput = document.querySelector("#pix-email");

  if (displayName && !cardNameInput.value) {
    cardNameInput.value = displayName;
  }

  if (displayName && !pixNameInput.value) {
    pixNameInput.value = displayName;
  }

  if (profile.email && !pixEmailInput.value) {
    pixEmailInput.value = profile.email;
  }
}

function renderSubscriptionState(subscription) {
  if (!subscription) {
    updateUserMenu();
    return;
  }

  const plan = subscriptionPlans[subscription.plan] || subscriptionPlans.monthly;
  usageHint.textContent = `Interesse ${plan.label.toLowerCase()} registrado neste navegador.`;
  updateUserMenu();
}

async function handleSubscriptionSubmit() {
  const activeForm = getActivePaymentForm();

  if (!activeForm.reportValidity()) {
    setPaymentHint("Revise os campos antes de registrar o interesse.", "warning");
    return;
  }

  if (!subscriptionTerms.checked) {
    setPaymentHint("Confirme que nenhuma cobrança será processada neste ambiente.", "warning");
    subscriptionTerms.reportValidity();
    return;
  }

  const plan = getSelectedPlan();
  const subscription = {
    plan,
    paymentMethod: selectedPaymentMethod,
    startedAt: new Date().toISOString()
  };

  window.sessionStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscription));
  renderSubscriptionState(subscription);
  setPaymentHint("Interesse registrado neste navegador.", "success");

  if (window.LunaApi) {
    try {
      await ensureBackendSession();
      await window.LunaApi.createSubscriptionIntent({
        plan,
        paymentMethod: selectedPaymentMethod
      });
      setPaymentHint("Interesse salvo. Nenhum pagamento foi processado.", "success");
    } catch {
      setPaymentHint("Interesse registrado neste navegador. Não consegui salvar fora daqui agora.", "warning");
    }
  }

  window.setTimeout(closeSubscriptionModal, 800);
}

function getPublicSiteProfile(account) {
  return {
    source: account.source,
    name: account.name,
    given_name: account.given_name,
    email: account.email,
    ageConfirmed: account.ageConfirmed,
    termsAccepted: account.termsAccepted,
    newsAccepted: account.newsAccepted,
    createdAt: account.createdAt
  };
}

function saveSiteAccount(account) {
  window.sessionStorage.setItem(SITE_ACCOUNT_STORAGE_KEY, JSON.stringify(account));
  saveActiveProfile(getPublicSiteProfile(account));
}

async function handleSignupSubmit(event) {
  event.preventDefault();

  const formData = new FormData(signupForm);
  const name = String(formData.get("name") || "").trim();
  const email = normalizeEmail(String(formData.get("email") || ""));
  const password = String(formData.get("password") || "");
  const passwordConfirm = String(formData.get("passwordConfirm") || "");
  const ageConfirmed = formData.get("ageConfirmed") === "on";
  const termsAccepted = formData.get("termsAccepted") === "on";
  const newsAccepted = formData.get("newsAccepted") === "on";

  if (!name || !email || password.length < 8 || password !== passwordConfirm || !ageConfirmed || !termsAccepted) {
    if (password !== passwordConfirm) {
      setLoginHint("As senhas precisam ser iguais.", true);
      return;
    }

    setLoginHint("Revise os campos obrigatórios do cadastro.", true);
    signupForm.reportValidity();
    return;
  }

  if (window.LunaApi) {
    try {
      const session = await window.LunaApi.signup({
        displayName: name,
        email,
        password,
        ageConfirmed,
        termsAccepted,
        newsAccepted
      });

      saveBackendSession(session);
      signupForm.reset();
      setLoginHint("Conta criada. Você já pode conversar com a Luna.");
      return;
    } catch (error) {
      setLoginHint(`${error.message} Vou manter o acesso neste navegador por enquanto.`, true);
    }
  }

  const account = {
    source: "site",
    name,
    given_name: name.split(" ")[0],
    email,
    passwordToken: getDemoPasswordToken(email, password),
    ageConfirmed,
    termsAccepted,
    newsAccepted,
    createdAt: new Date().toISOString()
  };

  saveSiteAccount(account);
  signupForm.reset();
  setLoginHint("Conta criada para este navegador.");
}

async function handleSigninSubmit(event) {
  event.preventDefault();

  const formData = new FormData(signinForm);
  const email = normalizeEmail(String(formData.get("email") || ""));
  const password = String(formData.get("password") || "");
  if (window.LunaApi) {
    try {
      const session = await window.LunaApi.login({ email, password });

      saveBackendSession(session);
      signinForm.reset();
      setLoginHint("Entrada feita. Você já pode conversar com a Luna.");
      return;
    } catch {
      setLoginHint("Não encontrei essa conta fora deste navegador. Vou tentar o acesso local.", true);
    }
  }

  const account = loadSiteAccount();
  const passwordToken = getDemoPasswordToken(email, password);

  if (!account || account.email !== email || account.passwordToken !== passwordToken) {
    setLoginHint("Use a conta criada nesta sessão ou crie uma nova.", true);
    signinForm.reportValidity();
    return;
  }

  saveActiveProfile(getPublicSiteProfile(account));
  signinForm.reset();
  setLoginHint("Entrada feita neste navegador.");
}

async function handleGoogleCredential(response) {
  try {
    const profile = decodeJwtPayload(response.credential);

    if (window.LunaApi) {
      try {
        const session = await window.LunaApi.google(response.credential);

        saveBackendSession(session);
        setLoginHint("Entrada com Google feita.");
        return;
      } catch (error) {
        setLoginHint(`${error.message} Mantive o acesso do Google neste navegador.`, true);
      }
    }

    saveGoogleProfile(profile);
    setLoginHint("Entrada com Google feita neste navegador.");
  } catch {
    setLoginHint("Não foi possível ler o retorno do Google. Tente novamente.", true);
  }
}

function waitForGoogleIdentity(attemptsLeft = 24) {
  if (window.google?.accounts?.id) {
    return Promise.resolve(true);
  }

  if (attemptsLeft <= 0) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    window.setTimeout(() => {
      waitForGoogleIdentity(attemptsLeft - 1).then(resolve);
    }, 250);
  });
}

function initializeGoogleAuth() {
  if (googleAuthInitialized) {
    return;
  }

  if (!hasGoogleClientId()) {
    setLoginHint("Entrada com Google ainda não está disponível neste acesso.", true);
    return;
  }

  waitForGoogleIdentity().then((isReady) => {
    if (!isReady) {
      setLoginHint("Não consegui carregar o login do Google. Verifique a conexão e tente novamente.", true);
      return;
    }

    window.google.accounts.id.initialize({
      client_id: getGoogleClientId(),
      callback: handleGoogleCredential,
      ux_mode: "popup"
    });

    window.google.accounts.id.renderButton(googleButton, {
      theme: "filled_black",
      size: "large",
      type: "standard",
      shape: "pill",
      text: "signin_with",
      logo_alignment: "left",
      locale: "pt-BR",
      width: 260
    });

    googleAuthInitialized = true;
  });
}

function toggleLoginPanel() {
  if (!canShowAuthUi()) {
    return;
  }

  const willOpen = loginPanel.hidden;
  loginPanel.hidden = !willOpen;
  loginButton.setAttribute("aria-expanded", String(willOpen));

  if (willOpen) {
    setAuthMode("signup");
    setLoginHint("Crie uma conta para continuar neste navegador.");
    initializeGoogleAuth();
  }
}

function updateUsageState() {
  countEl.textContent = Number.isFinite(remainingMessages) ? remainingMessages : "∞";
  usageCard.classList.toggle("is-low", remainingMessages > 0 && remainingMessages <= LOW_MESSAGE_THRESHOLD);
  usageCard.classList.toggle("is-empty", remainingMessages === 0);

  if (remainingMessages === 0) {
    usageHint.textContent = "O limite local foi atingido.";
    updateComposerAvailability();
    updateUserMenu();
    return;
  }

  if (remainingMessages <= LOW_MESSAGE_THRESHOLD) {
    usageHint.textContent = "Você está chegando ao limite local.";
    updateComposerAvailability();
    updateUserMenu();
    return;
  }

  const subscription = loadSubscription();

  if (subscription) {
    const plan = subscriptionPlans[subscription.plan] || subscriptionPlans.monthly;
    usageHint.textContent = `Interesse ${plan.label.toLowerCase()} registrado neste navegador.`;
    updateComposerAvailability();
    updateUserMenu();
    return;
  }

  if (backendConversationActive) {
    usageHint.textContent = "Continuidade ativa para esta conversa.";
    updateComposerAvailability();
    updateUserMenu();
    return;
  }

  usageHint.textContent = DEBUG_UI ? "Limite local ativo para desenvolvimento." : "";
  updateComposerAvailability();
  updateUserMenu();
}

async function ensureBackendSession() {
  const storedSession = loadBackendSession();

  if (storedSession?.token) {
    window.LunaApi?.setToken(storedSession.token);
    return storedSession;
  }

  if (!window.LunaApi) {
    return null;
  }

  const displayName = loadStoredProfile()?.name || "Visitante";
  const session = await window.LunaApi.createGuest(displayName);
  saveBackendSession(session);

  return session;
}

async function getBackendReply(userText) {
  if (!window.LunaApi) {
    return null;
  }

  try {
    await ensureBackendSession();
    const response = await window.LunaApi.sendMessage(userText);

    backendConversationActive = true;
    latestRelationship = response.relationship || latestRelationship;

    usageHint.textContent = response.usedAi ? "Continuidade ativa para esta conversa." : "Continuidade local salva para esta conversa.";

    updateUserMenu();
    return response.reply;
  } catch (error) {
    console.warn("Luna backend indisponível:", error.message);
    return null;
  }
}

async function replyAsLuna(forcedReply = "", userText = "", userMessage = null) {
  if (isLunaTyping) {
    return;
  }

  isLunaTyping = true;
  updateComposerAvailability();
  setLunaPresence(true);
  await wait(getReadingDelay(userText));
  updateMessageStatus(userMessage, "read");
  await wait(getComprehensionDelay(userText));
  showLunaTypingIndicator();

  const startedAt = Date.now();
  const backendReply = forcedReply ? null : await getBackendReply(userText);
  const rawReply = forcedReply || backendReply || chooseLunaReply(userText);
  const reply = backendReply ? rawReply : normalizeLunaReply(rawReply);
  const typingDelay = getTypingDelay(reply);
  const elapsed = Date.now() - startedAt;
  const remainingTypingDelay = Math.max(320, typingDelay - elapsed);

  await wait(remainingTypingDelay);
  hideLunaTypingIndicator();
  addMessage(reply, "luna");
  isLunaTyping = false;
  updateUsageState();
  updateLunaPresenceFromWindow();
}

composer.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text || remainingMessages <= 0 || isLunaTyping) {
    return;
  }

  const userMessage = addMessage(text, "user", { status: "sent" });
  input.value = "";
  resizeComposer();
  remainingMessages -= 1;
  updateUsageState();

  if (DEBUG_UI) {
    window.setTimeout(() => {
      if (userMessage.dataset.messageStatus === "sent") {
        updateMessageStatus(userMessage, "delivered");
      }
    }, 620);
  }

  if (remainingMessages === 0) {
    replyAsLuna("acabaram as mensagens de hoje por aqui. amanhã a gente continua.", text, userMessage);
    return;
  }

  replyAsLuna("", text, userMessage);
});

input.addEventListener("input", resizeComposer);

input.addEventListener("input", updateSuggestionVisibility);

input.addEventListener("paste", () => {
  window.requestAnimationFrame(resizeComposer);
});

input.addEventListener("cut", () => {
  window.requestAnimationFrame(resizeComposer);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    composer.requestSubmit();
  }
});

if (DEBUG_UI) {
  window.addEventListener("focus", setLunaOnline);
  window.addEventListener("blur", setLunaLastSeen);
  document.addEventListener("visibilitychange", updateLunaPresenceFromWindow);
}

loginButton.addEventListener("click", toggleLoginPanel);

menuToggle.addEventListener("click", () => {
  if (userMenuOverlay.hidden) {
    openUserMenu("account");
    return;
  }

  closeUserMenu();
});

userMenuClose.addEventListener("click", closeUserMenu);

userMenuOverlay.addEventListener("click", (event) => {
  if (event.target === userMenuOverlay) {
    closeUserMenu();
  }
});

userMenuTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setUserMenuTab(tab.dataset.menuTab);
  });
});

profilePhotoInput.addEventListener("change", () => {
  const file = profilePhotoInput.files?.[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    const photo = String(reader.result || "");

    if (!photo) {
      return;
    }

    window.sessionStorage.setItem(PROFILE_PHOTO_STORAGE_KEY, photo);
    const profile = loadStoredProfile() || { source: "visual", name: "Visitante" };
    renderSignedInState(profile);
    updateUserMenu();
  });

  reader.readAsDataURL(file);
});

menuAccountLogin.addEventListener("click", () => {
  closeUserMenu();

  if (!loginButton.hidden) {
    toggleLoginPanel();
  }
});

menuAccountPremium.addEventListener("click", () => {
  closeUserMenu();
  openSubscriptionModal();
});

chatSuggestionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.chatSuggestion || button.textContent.trim();
    resizeComposer();
    updateSuggestionVisibility();
    focusConversation();
  });
});

accountTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setAuthMode(tab.dataset.authMode);
    setLoginHint(tab.dataset.authMode === "signup" ? "Crie uma conta para continuar neste navegador." : "Entre com a conta criada neste navegador.");
  });
});

signupForm.addEventListener("submit", handleSignupSubmit);
signinForm.addEventListener("submit", handleSigninSubmit);

forgotPasswordButton.addEventListener("click", () => {
  setLoginHint("Recuperação de senha ainda não está disponível neste acesso.", true);
});

subscriptionClose.addEventListener("click", closeSubscriptionModal);

subscriptionOverlay.addEventListener("click", (event) => {
  if (event.target === subscriptionOverlay) {
    closeSubscriptionModal();
  }
});

initializeLunaCarousel();

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (!imageViewer.hidden) {
    closeImageViewer();
    return;
  }

  if (!userMenuOverlay.hidden) {
    closeUserMenu();
    return;
  }

  if (!subscriptionOverlay.hidden) {
    closeSubscriptionModal();
  }
});

imageViewerTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openImageViewer(trigger);
  });
});

imageViewerClose.addEventListener("click", closeImageViewer);

imageViewer.addEventListener("click", (event) => {
  if (event.target === imageViewer) {
    closeImageViewer();
  }
});

paymentTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setPaymentMethod(tab.dataset.paymentMethod);
  });
});

planOptions.forEach((option) => {
  option.addEventListener("change", updateSelectedPlan);
});

cardNumberInput.addEventListener("input", () => {
  cardNumberInput.value = formatDigitGroups(cardNumberInput.value, [4, 4, 4, 4]);
});

cardExpiryInput.addEventListener("input", () => {
  cardExpiryInput.value = formatExpiry(cardExpiryInput.value);
});

[cardCpfInput, pixCpfInput].forEach((cpfInput) => {
  cpfInput.addEventListener("input", () => {
    cpfInput.value = formatCpf(cpfInput.value);
  });
});

cardPaymentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSubscriptionSubmit();
});

pixPaymentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSubscriptionSubmit();
});

subscriptionSubmit.addEventListener("click", handleSubscriptionSubmit);

supportTopicButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const topic = button.dataset.supportTopic;
    const reply = supportReplies[topic];

    appendSupportMessage(button.textContent.trim(), "user");
    window.setTimeout(() => appendSupportMessage(reply, "bot"), 260);
  });
});

supportForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendSupportMessage(supportInput.value);
  supportInput.value = "";
});

logoutButton.addEventListener("click", () => {
  window.sessionStorage.removeItem(AUTH_PROFILE_STORAGE_KEY);
  window.sessionStorage.removeItem(BACKEND_SESSION_STORAGE_KEY);
  window.sessionStorage.removeItem(LEGACY_GOOGLE_STORAGE_KEY);
  window.sessionStorage.removeItem(PROFILE_PHOTO_STORAGE_KEY);
  window.LunaApi?.clearToken();
  window.google?.accounts?.id?.disableAutoSelect();
  renderSignedOutState();
});

applyDebugUi();
applyPublicFeatureVisibility();
hydrateInitialMessageTimes();

if (DEBUG_UI) {
  updateLunaPresenceFromWindow();
}

updateUsageState();
resizeComposer();
updateSelectedPlan();
renderSubscriptionState(loadSubscription());
updateSuggestionVisibility();

const storedBackendSession = loadBackendSession();

if (storedBackendSession?.token) {
  window.LunaApi?.setToken(storedBackendSession.token);
}

const storedProfile = loadStoredProfile();

if (storedProfile) {
  renderSignedInState(storedProfile);
} else {
  renderSignedOutState();
}
