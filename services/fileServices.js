import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { AppError } from "../errors/appErrors.js";
import {
  createFile as createFileRipository,
  getFile as getFileRipository,
  updateFile as updateFileRepository,
  deleteFile as deleteFileRepository,
  getFiles as getFilesRepository,
  getFilesCount as getFilesCountRepository,
} from "../respositories/fileRepository.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// reusable function
function getFilePath(fileName) {
  return path.join(__dirname, "../data", fileName);
}

// get list
export async function listFiles({ page, limit, search, sort, order, fromDate, toDate }) {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const allowedSortFields = ["file_name", "created_at"];

  if (!allowedSortFields.includes(sort)) {
    sort = "created_at";
  }

  const allowedOrder = ["asc", "desc"];

  order = order?.toLowerCase();

  if (!allowedOrder.includes(order)) {
    order = "desc";
  }

  const files =  await getFilesRepository({ search, sort, order, limit, offset, fromDate, toDate });
  const totalRecords = await getFilesCountRepository({search,fromDate,toDate});

  const totalPages = Math.ceil(totalRecords / limit);

  return {
    data: files,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  }
}

// read file context
export async function readContent(fileName) {
  const file = await getFileRipository(fileName);
  if (!file) {
    throw new AppError("File not found", 404);
  }
  return file;
}

// create file post method
export async function createFile(fileName, content) {
  await createFileRipository(fileName, content);
}

//update file pu method
export async function updateFile(fileName, content) {
  const updated = await updateFileRepository(fileName, content);

  if (!updated) {
    throw new AppError("File not found", 404);
  }
}

//delete file
export async function deleteFile(fileName) {
  const filePath = getFilePath(fileName);

  const deleted = await deleteFileRepository(fileName);

  if (!deleted) {
    throw new AppError("File not found", 404);
  }
}
