class LunaApiClient {
  constructor(config = {}) {
    this.baseUrl = (config.baseUrl || "").replace(/\/$/u, "");
    this.token = "";
  }

  setToken(token) {
    this.token = token || "";
  }

  clearToken() {
    this.token = "";
  }

  async request(path, options = {}) {
    if (!this.baseUrl) {
      throw new Error("API da Luna nao configurada");
    }

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = payload.message || payload.error || "Falha na API da Luna";
      throw new Error(message);
    }

    return payload;
  }

  health() {
    return this.request("/health");
  }

  createGuest(displayName = "Visitante") {
    return this.request("/auth/guest", {
      method: "POST",
      body: JSON.stringify({ displayName })
    });
  }

  signup(data) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  login(data) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  google(credential) {
    return this.request("/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential })
    });
  }

  sendMessage(text) {
    return this.request("/chat/message", {
      method: "POST",
      body: JSON.stringify({ text })
    });
  }

  getHistory() {
    return this.request("/chat/history");
  }

  createSubscriptionIntent(data) {
    return this.request("/waitlist/subscription-intent", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
}

window.LunaApi = new LunaApiClient(window.LUNA_API_CONFIG);
