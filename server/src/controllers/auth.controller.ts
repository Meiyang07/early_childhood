// src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import type { loginAdminInput } from "../validators/auth.js";
import { Staff } from "../models/Staff.js";
import { HttpError } from "../middleware/errorHandler.js";
import { signAccessToken, signRefreshToken } from "../utils/token.js";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies.js";
import { Types } from "mongoose";

export async function adminLogin(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as loginAdminInput;

  // ❌ Removed .select("-passwordHash") and .lean()
  // passwordHash is `select: false` in schema, so explicitly select it.
  const existingAdmin = await Staff.findOne({
    email: email.toLowerCase().trim(),
    deletedAt: null,
  }).select("+passwordHash");

  if (!existingAdmin) {
    throw new HttpError(401, "Invalid email or password");
  }

  // ✅ await the async compare
  const isMatch = await existingAdmin.comparePassword(password);
  if (!isMatch) {
    throw new HttpError(401, "Invalid email or password");
  }

  // ✅ Keep payload shape consistent with middleware (uses `sub`)
  const payload = {
    sub: existingAdmin._id.toString(),
    email: existingAdmin.email,
    username: existingAdmin.fullName,
    role: existingAdmin.role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  setAuthCookies(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: existingAdmin._id,
        email: existingAdmin.email,
        username: existingAdmin.fullName,
        role: existingAdmin.role,
      },
    },
  });
}




export async function me(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) throw new HttpError(401, "Not authenticated");
  if (!Types.ObjectId.isValid(userId)) {
    throw new HttpError(401, "Invalid session");
  }

  // passwordHash is `select: false` in the schema — it won't be returned.
  const admin = await Staff.findOne({
    _id: userId,
    deletedAt: null, // don't leak soft-deleted accounts
  })
    .select("fullName email role image status createdAt")
    .lean();

  if (!admin) {
    // Token is valid but the user no longer exists → force re-login
    throw new HttpError(401, "Account no longer exists");
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: admin._id,
        email: admin.email,
        username: admin.fullName,
        role: admin.role,
        image: admin.image,
        status: admin.status,
        createdAt: admin.createdAt,
      },
    },
  });

}




export async function adminLogout(_req: Request, res: Response): Promise<void> {
  clearAuthCookies(res);
  res.status(200).json({ success: true, data: { message: "Logged out" } });
}