// src/index.ts
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./db/connection.js"; // 👈 import
import type { Server } from "node:http";

const app = createApp();
let server: Server;

async function startServer(): Promise<void> {
  // Connect to MongoDB FIRST
  await connectDB(env.DATABASE_URL); // 👈 await connection

  server = app.listen(env.PORT, env.HOST, () => {
    console.log(
      `[${env.NODE_ENV}] Server listening on http://${env.HOST}:${env.PORT}`
    );
  });

  server.on("error", (err) => {
    console.error("[SERVER ERROR]", err);
    process.exit(1);
  });
}

function shutdown(signal: string): void {
  console.log(`\n[${signal}] Shutting down gracefully...`);

  const forceExitTimer = setTimeout(() => {
    console.error("[SHUTDOWN] Forced exit after 10s");
    process.exit(1);
  }, 10_000);
  forceExitTimer.unref();

  server.close(async (err) => {
    if (err) {
      console.error("[SHUTDOWN] Error closing server:", err);
      process.exit(1);
    }
    console.log("[SHUTDOWN] HTTP server closed");

    try {
      await disconnectDB(); // 👈 close DB
      console.log("[SHUTDOWN] MongoDB disconnected");
    } catch (e) {
      console.error("[SHUTDOWN] Error disconnecting DB:", e);
    }
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("[UNHANDLED REJECTION]", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[UNCAUGHT EXCEPTION]", err);
  shutdown("uncaughtException");
});

// 👇 handle async startup rejection
startServer().catch((err) => {
  console.error("[STARTUP ERROR]", err);
  process.exit(1);
});