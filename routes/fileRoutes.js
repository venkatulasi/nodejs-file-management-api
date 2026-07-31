import express from "express";
import {
  getFiles,
  uploadFile as uploadFileController,
  deleteFile as deleteFileController,
} from "../controllers/fileController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validationPagination } from "../middleware/validatePagination.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get(
  "/files",
  asyncHandler(validationPagination),
  asyncHandler(getFiles),
);
router.post(
  "/files/upload",
  upload.single("file"),
  asyncHandler(uploadFileController),
);
router.delete("/files/:id", asyncHandler(deleteFileController));

export default router;
