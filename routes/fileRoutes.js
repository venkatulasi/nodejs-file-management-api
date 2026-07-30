import express from "express";
import {
  getFiles,
  getFile,
  createFile as createFileController,
  updateFile as updateFileController,
  deleteFile as deleteFileController,
} from "../controllers/fileController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validationPagination } from "../middleware/validatePagination.js";

const router = express.Router();

router.get(
  "/files",
  asyncHandler(validationPagination),
  asyncHandler(getFiles),
);
router.get("/files/:fileName", asyncHandler(getFile));
router.post("/files", asyncHandler(createFileController));
router.put("/files/:fileName", asyncHandler(updateFileController));
router.delete("/files/:fileName", asyncHandler(deleteFileController));

export default router;
