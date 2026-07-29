import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ override: true, quiet: true });

const configSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().default("file:./dev.db"),
  JWT_SECRET: z.string().min(12).default("luna-dev-secret-change-me"),
  FRONTEND_ORIGIN: z.string().default("http://127.0.0.1:5173,http://localhost:5173"),
  LUNA_MODEL_PROVIDER: z.enum(["local", "openai"]).default("local"),
  OPENAI_API_KEY: z.string().optional().default(""),
  OPENAI_MODEL: z.string().default("gpt-5.6-luna"),
  OPENAI_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(220),
  GOOGLE_CLIENT_ID: z.string().optional().default("")
});

const env = configSchema.parse(process.env);

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
  jwtSecret: env.JWT_SECRET,
  frontendOrigins: env.FRONTEND_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean),
  lunaModelProvider: env.LUNA_MODEL_PROVIDER,
  openaiApiKey: env.OPENAI_API_KEY,
  openaiModel: env.OPENAI_MODEL,
  openaiMaxOutputTokens: env.OPENAI_MAX_OUTPUT_TOKENS,
  googleClientId: env.GOOGLE_CLIENT_ID
};
