// src/middleware/validate.ts
import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";
import { HttpError } from "./errorHandler.js";

type Source = "body" | "query" | "params";

export const validate =
  (schemas: Partial<Record<Source, ZodType>>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      for (const key of ["body", "query", "params"] as Source[]) {
        const schema = schemas[key];
        if (!schema) continue;

        const parsed = schema.parse(req[key]);

        if (key === "query") {
          // Express 5: `req.query` is a getter-only property.
          // We can't do `req.query = parsed`. Mutate the object in place instead.
          const target = req.query as Record<string, unknown>;
          for (const k of Object.keys(target)) delete target[k];
          Object.assign(target, parsed);
        } else {
          // body and params are still writable
          (req as unknown as Record<string, unknown>)[key] = parsed;
        }
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(
          new HttpError(
            422,
            "Validation failed",
            err.issues.map((i) => ({
              path: i.path.join("."),
              message: i.message,
            })),
          ),
        );
      }
      next(err);
    }
  };