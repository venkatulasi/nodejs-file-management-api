import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateLogin, validateRefresh, validateRegister } from "../middleware/auth.validation.js";
import { login, logout, refresh, register } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { originCheck } from "../middleware/originCheck.js";
import { changePassword } from "../controllers/user.controller.js";

const router = Router();

router.post("/register", validateRegister, asyncHandler(register));
router.post("/login", authLimiter, validateLogin, asyncHandler(login));
router.post("/logout",  originCheck, asyncHandler(logout));
router.post("/refresh", originCheck, validateRefresh, asyncHandler(refresh));
router.post("/change-password", authMiddleware, asyncHandler(changePassword));

export default router;