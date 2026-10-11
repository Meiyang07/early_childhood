import {Router} from "express"

import { loginSchema } from "../validators/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { adminLogin, adminLogout, me } from "../controllers/auth.controller.js";
import { refreshSession, requireAuth } from "../middleware/auth.js";

export const authRouter=Router();

authRouter.post("/admin-login",validate({body:loginSchema}),asyncHandler(adminLogin));
authRouter.get("/me",requireAuth,asyncHandler(me));
authRouter.post("/refresh",refreshSession);
authRouter.post("/admin-logout",requireAuth,asyncHandler(adminLogout));