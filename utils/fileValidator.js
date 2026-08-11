import { fileTypeFromFile } from "file-type";
import { AppError } from "../errors/AppErrors.js";

const allowedMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
];

export async function validateUploadedFile(file) {
  if (!file) {
    throw new AppError("File is required", 400);
  }

  const detectedType = await fileTypeFromFile(file.path);

  if (!detectedType) {
    throw new AppError("Unable to determine file type", 400);
  }

  // Validate the actual file content
  if (!allowedMimeTypes.includes(detectedType.mime)) {
    throw new AppError(
      "Only PDF, PNG and JPEG files are allowed",
      400,
    );
  }

  // Make sure the client-provided MIME matches the actual file
  if (file.mimetype !== detectedType.mime) {
    throw new AppError(
      "File type does not match its content",
      400,
    );
  }

  return detectedType;
}