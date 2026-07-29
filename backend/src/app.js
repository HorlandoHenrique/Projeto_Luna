import Fastify from "fastify";
import cors from "@fastify/cors";
import authPlugin from "./plugins/auth.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import waitlistRoutes from "./routes/waitlist.routes.js";
import { config } from "./config.js";

export function buildApp() {
  const app = Fastify({
    logger: {
      level: config.nodeEnv === "development" ? "info" : "warn"
    }
  });

  app.register(cors, {
    origin(origin, callback) {
      if (!origin || config.frontendOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origem nao permitida pelo CORS"), false);
    },
    credentials: true
  });

  app.register(authPlugin);

  app.get("/", async () => ({
    name: "Luna API",
    status: "ok"
  }));

  app.get("/health", async () => ({
    ok: true,
    ai: config.lunaModelProvider === "openai" && Boolean(config.openaiApiKey),
    modelProvider: config.lunaModelProvider === "openai" && config.openaiApiKey ? "openai" : "local",
    model: config.lunaModelProvider === "openai" && config.openaiApiKey ? config.openaiModel : "local-fallback",
    database: "sqlite"
  }));

  app.register(authRoutes, { prefix: "/auth" });
  app.register(chatRoutes, { prefix: "/chat" });
  app.register(waitlistRoutes, { prefix: "/waitlist" });

  return app;
}
