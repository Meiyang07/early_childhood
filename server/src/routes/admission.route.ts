import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createApplicationSchema, listApplicationQuerySchema } from "../validators/addmission.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { createApplication, deleteApplication, getAllApplications } from "../controllers/admission.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";



export const applicationRouter = Router();

// --- Public Route: Submit Application ---
applicationRouter.post(
  "/create-adimission",
  validate({ body: createApplicationSchema }),
  asyncHandler(createApplication)
);


applicationRouter.get(
  "/all-adimission",
  requireAuth, 
  requireRole("ADMIN"),
  validate({ query: listApplicationQuerySchema }),
  asyncHandler(getAllApplications)
);

applicationRouter.delete("/application/delete/:id", requireAuth, asyncHandler(deleteApplication));