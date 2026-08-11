import multer from "multer";
import crypto from "crypto";
import { AppError } from "../errors/AppErrors.js";
import path from "path";

const uploadDirectory = path.resolve("upload");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, crypto.randomUUID());
  },
});

const allowTypes = ["application/pdf", "image/png", "image/jpeg"];

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowTypes.includes(file.mimetype)) {
      return cb(new AppError("Only PDF, PNG and JPEG files are allowed", 400));
    }
    cb(null, true);
  },
});

export default upload;
