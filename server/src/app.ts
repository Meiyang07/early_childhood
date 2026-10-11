// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import stafRouter from "./routes/staff.route.js";
import { authRouter } from "./routes/auth.route.js";
import { applicationRouter } from "./routes/admission.route.js";
import { testimonialRouter } from "./routes/testimonial.route.js";
import programRouter from "./routes/program.route.js";
import photoRouter from "./routes/photo.route.js";
import eventRouter from "./routes/event.route.js";
import blogRouter from "./routes/blog.route.js";


export function createApp() {
  const app = express();

  if (env.TRUST_PROXY) app.set("trust proxy", 1);

  app.use(helmet());
  app.use(compression());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (env.CORS_ORIGIN.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked: ${origin}`));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());

  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, error: { message: "Too many requests" } },
    })
  );

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      env: env.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });


  app.use("/api/auth", authRouter);
  app.use("/api/staff", stafRouter);
  app.use("/api/addmission", applicationRouter);
  app.use("/api/testimonial", testimonialRouter);
  app.use("/api/programs", programRouter);
  app.use("/api/photo", photoRouter);
  app.use("/api/events", eventRouter);
  app.use("/api/blog", blogRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}