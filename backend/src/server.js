import { buildApp } from "./app.js";
import { closeDatabase } from "./db.js";
import { config } from "./config.js";

const app = buildApp();

const shutdown = async () => {
  await app.close();
  await closeDatabase();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

try {
  await app.listen({
    host: "127.0.0.1",
    port: config.port
  });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
