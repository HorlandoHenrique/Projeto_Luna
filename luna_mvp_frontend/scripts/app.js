const composer = document.querySelector("#composer");
const input = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
const messageList = document.querySelector("#message-list");
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
const subscribeButton = document.querySelector("#subscribe-button");
const premiumButton = document.querySelector("#premium-button");
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

const DAILY_MESSAGE_LIMIT = 20;
const LOW_MESSAGE_THRESHOLD = 5;
const COMPOSER_MAX_TEXTAREA_HEIGHT = 132;
const LUNA_TYPING_MIN_DELAY_MS = 900;
const LUNA_TYPING_MAX_DELAY_MS = 5400;
const LUNA_TYPING_DOT_INTERVAL_MS = 520;
const LUNA_LEARNED_WORD_SLIP_RATE = 0.08;
const LUNA_MANUAL_CORRECTION_SKIP_RATE = 0.02;
const AUTH_PROFILE_STORAGE_KEY = "luna_auth_profile";
const BACKEND_SESSION_STORAGE_KEY = "luna_backend_session";
const SITE_ACCOUNT_STORAGE_KEY = "luna_site_demo_account";
const SUBSCRIPTION_STORAGE_KEY = "luna_subscription_demo";
const LEGACY_GOOGLE_STORAGE_KEY = "luna_google_profile";
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

function scrollMessagesToBottom() {
  messageList.scrollTop = messageList.scrollHeight;
}

function addMessage(text, author) {
  const message = document.createElement("div");
  message.className = `message-bubble message-bubble--${author}`;
  message.textContent = text;
  messageList.appendChild(message);
  scrollMessagesToBottom();
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
  loginButton.hidden = false;
  loginButton.setAttribute("aria-expanded", "false");
  loginPanel.hidden = true;
  userChip.hidden = true;
  userAvatar.src = "";
}

function renderSignedInState(profile) {
  const displayName = getDisplayName(profile);

  loginButton.hidden = true;
  loginPanel.hidden = true;
  userChip.hidden = false;
  userName.textContent = displayName;
  userAvatar.src = profile.picture || getInitialAvatar(displayName);
  userAvatar.alt = profile.picture ? `Foto de ${displayName}` : `Inicial de ${displayName}`;
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
  return readSessionJson(SITE_ACCOUNT_STORAGE_KEY);
}

function loadSubscription() {
  return readSessionJson(SUBSCRIPTION_STORAGE_KEY);
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

  setPaymentHint(method === "card" ? "Preencha os dados do cartão de teste." : "O Pix abaixo é apenas um código visual de teste.");
}

function updateSelectedPlan() {
  const selectedPlan = getSelectedPlan();
  const plan = subscriptionPlans[selectedPlan];

  planOptions.forEach((option) => {
    option.classList.toggle("is-selected", option.querySelector("input")?.value === selectedPlan);
  });

  pixCode.textContent = selectedPlan === "yearly" ? "LUNA.PIX.BETA.17990.TESTE" : "LUNA.PIX.BETA.1990.TESTE";
  subscriptionSubmit.textContent = `Confirmar ${plan.label.toLowerCase()} de teste`;
}

function getActivePaymentForm() {
  return selectedPaymentMethod === "pix" ? pixPaymentForm : cardPaymentForm;
}

function openSubscriptionModal() {
  subscriptionOverlay.hidden = false;
  document.body.classList.add("is-modal-open");
  loginPanel.hidden = true;
  loginButton.setAttribute("aria-expanded", "false");
  updateSelectedPlan();
  prefillSubscriptionIdentity();
  setPaymentMethod(selectedPaymentMethod);
}

function closeSubscriptionModal() {
  subscriptionOverlay.hidden = true;
  document.body.classList.remove("is-modal-open");
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
    subscribeButton.textContent = "Assinar";
    premiumButton.textContent = "Entrar na lista premium";
    return;
  }

  const plan = subscriptionPlans[subscription.plan] || subscriptionPlans.monthly;
  subscribeButton.textContent = "Assinatura ativa";
  premiumButton.textContent = `${plan.label} ativo`;
  usageHint.textContent = `Assinatura ${plan.label.toLowerCase()} de teste ativa nesta sessão.`;
}

async function handleSubscriptionSubmit() {
  const activeForm = getActivePaymentForm();

  if (!activeForm.reportValidity()) {
    setPaymentHint("Revise os campos do pagamento de teste.", "warning");
    return;
  }

  if (!subscriptionTerms.checked) {
    setPaymentHint("Confirme que este pagamento é apenas uma simulação visual.", "warning");
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
  setPaymentHint("Assinatura de teste ativada nesta sessão.", "success");

  if (window.LunaApi) {
    try {
      await ensureBackendSession();
      await window.LunaApi.createSubscriptionIntent({
        plan,
        paymentMethod: selectedPaymentMethod
      });
      setPaymentHint("Intenção premium salva no backend. Nenhum pagamento foi processado.", "success");
    } catch {
      setPaymentHint("Assinatura visual ativa. Backend indisponível para salvar a intenção agora.", "warning");
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
      setLoginHint("Conta criada com backend e memória persistente ativa.");
      return;
    } catch (error) {
      setLoginHint(`${error.message} Vou manter o modo visual por enquanto.`, true);
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
  setLoginHint("Conta de teste criada nesta sessão do navegador.");
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
      setLoginHint("Entrada feita com backend e histórico persistente.");
      return;
    } catch {
      setLoginHint("Não encontrei essa conta no backend. Vou tentar a sessão visual.", true);
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
  setLoginHint("Entrada simulada nesta sessão do navegador.");
}

async function handleGoogleCredential(response) {
  try {
    const profile = decodeJwtPayload(response.credential);

    if (window.LunaApi) {
      try {
        const session = await window.LunaApi.google(response.credential);

        saveBackendSession(session);
        setLoginHint("Login Google feito com backend.");
        return;
      } catch (error) {
        setLoginHint(`${error.message} Mantive o login visual do Google.`, true);
      }
    }

    saveGoogleProfile(profile);
    setLoginHint("Login feito com Google nesta sessão do navegador.");
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
    setLoginHint("Configure o Google Client ID em scripts/auth-config.js para ativar este botão.", true);
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
  const willOpen = loginPanel.hidden;
  loginPanel.hidden = !willOpen;
  loginButton.setAttribute("aria-expanded", String(willOpen));

  if (willOpen) {
    setAuthMode("signup");
    setLoginHint("Crie uma conta de teste para esta sessão.");
    initializeGoogleAuth();
  }
}

function updateUsageState() {
  countEl.textContent = remainingMessages;
  usageCard.classList.toggle("is-low", remainingMessages > 0 && remainingMessages <= LOW_MESSAGE_THRESHOLD);
  usageCard.classList.toggle("is-empty", remainingMessages === 0);

  if (remainingMessages === 0) {
    usageHint.textContent = "As mensagens acabaram nesta simulação. A assinatura ainda não está ativa.";
    updateComposerAvailability();
    return;
  }

  if (remainingMessages <= LOW_MESSAGE_THRESHOLD) {
    usageHint.textContent = "Você está chegando ao limite simulado do beta.";
    updateComposerAvailability();
    return;
  }

  const subscription = loadSubscription();

  if (subscription) {
    const plan = subscriptionPlans[subscription.plan] || subscriptionPlans.monthly;
    usageHint.textContent = `Assinatura ${plan.label.toLowerCase()} de teste ativa nesta sessão.`;
    updateComposerAvailability();
    return;
  }

  if (backendConversationActive) {
    usageHint.textContent = "Memória e relacionamento salvos no backend.";
    updateComposerAvailability();
    return;
  }

  usageHint.textContent = "Este limite é apenas uma simulação do MVP.";
  updateComposerAvailability();
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

    if (response.usedAi) {
      usageHint.textContent = "IA, memória e relacionamento ativos no backend.";
    } else {
      usageHint.textContent = "Memória e relacionamento salvos no backend. IA entra quando a chave for configurada.";
    }

    return response.reply;
  } catch (error) {
    console.warn("Luna backend indisponível:", error.message);
    return null;
  }
}

async function replyAsLuna(forcedReply = "", userText = "") {
  if (isLunaTyping) {
    return;
  }

  isLunaTyping = true;
  updateComposerAvailability();
  showLunaTypingIndicator();

  const startedAt = Date.now();
  const backendReply = forcedReply ? null : await getBackendReply(userText);
  const rawReply = forcedReply || backendReply || chooseLunaReply(userText);
  const reply = backendReply ? rawReply : normalizeLunaReply(rawReply);
  const typingDelay = getTypingDelay(reply);
  const elapsed = Date.now() - startedAt;
  const remainingTypingDelay = Math.max(320, typingDelay - elapsed);

  window.setTimeout(() => {
    hideLunaTypingIndicator();
    addMessage(reply, "luna");
    isLunaTyping = false;
    updateUsageState();
  }, remainingTypingDelay);
}

composer.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text || remainingMessages <= 0 || isLunaTyping) {
    return;
  }

  addMessage(text, "user");
  input.value = "";
  resizeComposer();
  remainingMessages -= 1;
  updateUsageState();

  if (remainingMessages === 0) {
    replyAsLuna("acabaram as mensagens de hoje por aqui. amanhã a gente continua.");
    return;
  }

  replyAsLuna("", text);
});

input.addEventListener("input", resizeComposer);

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

loginButton.addEventListener("click", toggleLoginPanel);

accountTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setAuthMode(tab.dataset.authMode);
    setLoginHint(tab.dataset.authMode === "signup" ? "Crie uma conta de teste para esta sessão." : "Entre com a conta criada nesta sessão.");
  });
});

signupForm.addEventListener("submit", handleSignupSubmit);
signinForm.addEventListener("submit", handleSigninSubmit);

forgotPasswordButton.addEventListener("click", () => {
  setLoginHint("Recuperação de senha entra na etapa de backend.", true);
});

subscribeButton.addEventListener("click", openSubscriptionModal);
premiumButton.addEventListener("click", openSubscriptionModal);
subscriptionClose.addEventListener("click", closeSubscriptionModal);

subscriptionOverlay.addEventListener("click", (event) => {
  if (event.target === subscriptionOverlay) {
    closeSubscriptionModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !subscriptionOverlay.hidden) {
    closeSubscriptionModal();
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

logoutButton.addEventListener("click", () => {
  window.sessionStorage.removeItem(AUTH_PROFILE_STORAGE_KEY);
  window.sessionStorage.removeItem(BACKEND_SESSION_STORAGE_KEY);
  window.sessionStorage.removeItem(LEGACY_GOOGLE_STORAGE_KEY);
  window.LunaApi?.clearToken();
  window.google?.accounts?.id?.disableAutoSelect();
  renderSignedOutState();
});

updateUsageState();
resizeComposer();
updateSelectedPlan();
renderSubscriptionState(loadSubscription());

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
