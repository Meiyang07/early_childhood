// src/middleware/errorHandler.ts
import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

export class HttpError extends Error {
  statusCode: number;
  details?: unknown;
  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: { message: `Route not found: ${req.method} ${req.originalUrl}` },
  });
}

export function errorHandler(
  err: Error | HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const isOperational = err instanceof HttpError;

  if (env.isProduction && !isOperational) console.error("[UNHANDLED]", err);
  else console.error(`[${statusCode}] ${err.message}`);

  res.status(statusCode).json({
    success: false,
    error: {
      message: isOperational || !env.isProduction ? err.message : "Internal server error",
      ...(err instanceof HttpError && err.details ? { details: err.details } : {}),
      ...(env.isProduction ? {} : { stack: err.stack }),
    },
  });
}

export function asyncHandler<T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}