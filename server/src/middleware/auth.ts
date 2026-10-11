// src/middleware/auth.ts
import type { Request, Response, NextFunction } from "express";
import { HttpError } from "./errorHandler.js";
import { ACCESS_COOKIE, REFRESH_COOKIE, setAuthCookies } from "../utils/cookies.js";
import { env } from "../config/env.js"

import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/token.js";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) {
    console.warn("[requireAuth] no access_token cookie. Cookies present:", Object.keys(req.cookies ?? {}));
    return next(new HttpError(401, "Not authenticated: no access_token cookie"));
  }
  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    };
    next();
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`[requireAuth] verify failed: ${reason}`);
    console.warn(`[requireAuth] token prefix: ${token.slice(0, 25)}… len=${token.length}`);
    console.warn(`[requireAuth] secret len: ${env.JWT_ACCESS_SECRET.length}`);
    next(new HttpError(401, `Invalid or expired access token (${reason})`));
  }
}




export function refreshSession(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) throw new HttpError(401, "No refresh token");

    const payload = verifyRefreshToken(token);

    const newPayload = {
      sub: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    };

    setAuthCookies(
      res,
      signAccessToken(newPayload),
      signRefreshToken(newPayload)
    );

    res.json({ success: true, data: { message: "Session refreshed" } });
  } catch {
    next(new HttpError(401, "Invalid or expired refresh token"));
  }
}





export function requireRole(...allowedRoles: string[]) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      return next(new HttpError(401, "Not authenticated"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new HttpError(403, "You do not have permission to access this resource")
      );
    }

    next();
  };
}
