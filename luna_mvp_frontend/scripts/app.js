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

const DAILY_MESSAGE_LIMIT = 20;
const LOW_MESSAGE_THRESHOLD = 5;
const AUTH_PROFILE_STORAGE_KEY = "luna_auth_profile";
const SITE_ACCOUNT_STORAGE_KEY = "luna_site_demo_account";
const LEGACY_GOOGLE_STORAGE_KEY = "luna_google_profile";
const GOOGLE_CLIENT_ID_PLACEHOLDER = "COLE_SEU_GOOGLE_CLIENT_ID_AQUI.apps.googleusercontent.com";

let remainingMessages = DAILY_MESSAGE_LIMIT;
let googleAuthInitialized = false;

const lunaReplies = [
  "entendi. me fala um pouco mais disso.",
  "eu gosto quando a conversa começa assim, sem pressa.",
  "faz sentido. fiquei curiosa com essa parte.",
  "acho que eu te perguntaria o que ficou depois disso.",
  "tô aqui lendo com calma.",
  "isso parece pequeno, mas diz bastante.",
  "me conta do seu jeito. não precisa arrumar tudo antes."
];

function addMessage(text, author) {
  const message = document.createElement("div");
  message.className = `message-bubble message-bubble--${author}`;
  message.textContent = text;
  messageList.appendChild(message);
  messageList.scrollTop = messageList.scrollHeight;
}

function resizeComposer() {
  input.style.height = "auto";
  input.style.height = `${input.scrollHeight}px`;
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
  return readSessionJson(AUTH_PROFILE_STORAGE_KEY) || readSessionJson(LEGACY_GOOGLE_STORAGE_KEY);
}

function loadSiteAccount() {
  return readSessionJson(SITE_ACCOUNT_STORAGE_KEY);
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

function handleSignupSubmit(event) {
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

function handleSigninSubmit(event) {
  event.preventDefault();

  const formData = new FormData(signinForm);
  const email = normalizeEmail(String(formData.get("email") || ""));
  const password = String(formData.get("password") || "");
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

function handleGoogleCredential(response) {
  try {
    const profile = decodeJwtPayload(response.credential);
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
  resizeComposer();
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

input.addEventListener("input", resizeComposer);

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

logoutButton.addEventListener("click", () => {
  window.sessionStorage.removeItem(AUTH_PROFILE_STORAGE_KEY);
  window.sessionStorage.removeItem(LEGACY_GOOGLE_STORAGE_KEY);
  window.google?.accounts?.id?.disableAutoSelect();
  renderSignedOutState();
});

updateUsageState();
resizeComposer();

const storedProfile = loadStoredProfile();

if (storedProfile) {
  renderSignedInState(storedProfile);
} else {
  renderSignedOutState();
}
