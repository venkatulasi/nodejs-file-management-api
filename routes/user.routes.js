import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getUsers } from "../controllers/user.controller.js";
import { authorizePermission } from "../middleware/authorizePermissions.js";

const router = Router();

router.get("/", authMiddleware, authorizePermission("user:read"), asyncHandler(getUsers));

export default router;