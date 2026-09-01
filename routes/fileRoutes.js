import express from "express";
import {
  getFiles,
  uploadFile as uploadFileController,
  deleteFile as deleteFileController,
  downloadFile,
  renameFile,
} from "../controllers/fileController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validationPagination } from "../middleware/validatePagination.js";
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateFileId } from "../middleware/validationFileId.js";
import { authorizePermission } from "../middleware/authorizePermissions.js";

const router = express.Router();

router.get(
  "/files",
  authMiddleware,
  asyncHandler(validationPagination),
  asyncHandler(getFiles),
);
router.post(
  "/files/upload",
  authMiddleware,
  authorizePermission("file:upload"),
  upload.single("file"),
  asyncHandler(uploadFileController),
);
router.delete(
  "/files/:id",
  authMiddleware,
  authorizePermission("file:delete"),
  validateFileId,
  asyncHandler(deleteFileController),
);
router.get(
  "/files/:id/download",
  authMiddleware,
  authorizePermission("file:read"),
  validateFileId,
  asyncHandler(downloadFile),
);
router.patch(
  "/files/:id",
  authMiddleware,
  authorizePermission("file:rename"),
  validateFileId,
  asyncHandler(renameFile),
);

export default router;
