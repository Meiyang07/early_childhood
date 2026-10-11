// src/routes/staff.routes.ts
import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { validate } from "../middleware/validate.js";
import { createStaffSchema, listStaffQuerySchema } from "../validators/staff.js";
import { createStaff, getAllStaff } from "../controllers/staff.controller.js";
import { handleMulterError, uploadSingle } from "../middleware/upload.middleware.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const stafRouter = Router();

stafRouter.post(
  "/",

  requireAuth,
  requireRole("ADMIN"),
  uploadSingle("image"),
  handleMulterError,
  validate({ body: createStaffSchema }),
  asyncHandler(createStaff)
);


stafRouter.get(
  "/staff-all",
  validate({ query: listStaffQuerySchema }),
  asyncHandler(getAllStaff),
);

export default stafRouter;