import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateLogin, validateRefresh, validateRegister } from "../middleware/auth.validation.js";
import { login, logout, refresh, register } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validateRegister, asyncHandler(register));
router.post("/login",validateLogin, asyncHandler(login));
router.post("/logout",  asyncHandler(logout));
router.post("/refresh", validateRefresh, asyncHandler(refresh))

export default router;