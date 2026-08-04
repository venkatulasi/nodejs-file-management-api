import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { AppError } from "../errors/AppErrors.js";
import {
  uploadFile as uploadFileRipository,
  deleteFile as deleteFileRepository,
  getFiles as getFilesRepository,
  getFilesCount as getFilesCountRepository,
  getFileById as getFileByIdRepository,
} from "../repositories/fileRepository.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// reusable function
function getFilePath(fileName) {
  return path.join(__dirname, "../data", fileName);
}

// get list
export async function listFiles({
  page,
  limit,
  search,
  sort,
  order,
  fromDate,
  toDate,
}) {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const allowedSortFields = [
    "original_name",
    "stored_name",
    "mime_type",
    "size",
    "created_at",
  ];

  if (!allowedSortFields.includes(sort)) {
    sort = "created_at";
  }

  const allowedOrder = ["asc", "desc"];

  order = order?.toLowerCase();

  if (!allowedOrder.includes(order)) {
    order = "desc";
  }

  const files = await getFilesRepository({
    search,
    sort,
    order,
    limit,
    offset,
    fromDate,
    toDate,
  });
  const totalRecords = await getFilesCountRepository({
    search,
    fromDate,
    toDate,
  });

  const totalPages = Math.ceil(totalRecords / limit);

  return {
    data: files,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

// create file post method
export async function uploadFile(file) {
  console.log("files",file)
  try {
    await uploadFileRipository(file);
  } catch (error) {
    await fs.unlink(file.path);
    throw error;
  }
}

//Delete file
export async function deleteFile(id) {
  const file = getFileByIdRepository(id);

  if (!file) {
    throw new AppError("File not found", 400);
  }

  //Delete physical file first
  await fs.unlink(file.path);

  //Then delete database record
  const deleted = await deleteFileRepository(id);
}
