import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ override: true });

const configSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().default("file:./dev.db"),
  JWT_SECRET: z.string().min(12).default("luna-dev-secret-change-me"),
  FRONTEND_ORIGIN: z.string().default("http://127.0.0.1:5173,http://localhost:5173"),
  OPENAI_API_KEY: z.string().optional().default(""),
  OPENAI_MODEL: z.string().default("gpt-5.4-mini"),
  GOOGLE_CLIENT_ID: z.string().optional().default("")
});

const env = configSchema.parse(process.env);

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
  jwtSecret: env.JWT_SECRET,
  frontendOrigins: env.FRONTEND_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean),
  openaiApiKey: env.OPENAI_API_KEY,
  openaiModel: env.OPENAI_MODEL,
  googleClientId: env.GOOGLE_CLIENT_ID
};
