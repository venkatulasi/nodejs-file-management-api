import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateRegister } from "../middleware/auth.validation.js";
import { register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validateRegister, asyncHandler(register));

export default router;