import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { AppError } from "../errors/AppErrors.js";
import {
  uploadFile as uploadFileRipository,
  deleteFile as deleteFileRepository,
  getFiles as getFilesRepository,
  getFilesCount as getFilesCountRepository,
  getFileByIdRepository,
  updateFileNameRepository,
  softDeleteFileRepository,
} from "../repositories/fileRepository.js";
import { ensureFileOwnership } from "../utils/authorization.js";

// get list
export async function listFiles(
  { page, limit, search, sort, order, fromDate, toDate },
  user,
) {
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

  const userId = user.role === "admin" ? null : user.id;

  const files = await getFilesRepository({
    search,
    sort,
    order,
    limit,
    offset,
    fromDate,
    toDate,
    userId,
  });
  const totalRecords = await getFilesCountRepository({
    search,
    fromDate,
    toDate,
    userId,
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
export async function uploadFile(file, userId) {
  try {
    await uploadFileRipository(file, userId);
  } catch (error) {
    await fs.unlink(file.path);
    throw error;
  }
}

//Delete file
export async function softDeleteFileService(id, user) {

  const file = await getFileByIdRepository(id);

  if (!file) {
    throw new AppError("File not found", 404);
  }

  if (file.is_deleted) {
    return {
      success: true,
      message: "File already deleted",
    };
  }
  
  ensureFileOwnership(file, user);
  
  const deleteFile = await softDeleteFileRepository(file.id);

  if (!deleteFile) {
    throw new AppError("File not found", 404);
  }

  

  return {
    success: true,
    message: "File deleted successfully",
  };
}

//Download file
export async function downloadFileService(fileId, user) {
  const file = await getFileByIdRepository(fileId);

  if (!file) {
    throw new AppError("File not found", 404);
  }

  if (file.is_deleted) {
    throw new AppError("File already deleted", 404);
  }

  ensureFileOwnership(file, user);

  try {
    await fs.access(file.path);
  } catch (error) {
    throw new AppError("File not found", 404);
  }

  return file;
}

export async function renameFileService(originalName, fileId, user) {
  const file = await getFileByIdRepository(fileId);

  if (!file) {
    throw new AppError("File not found", 404);
  }

  if(file.is_deleted){
    throw new AppError("File already deleted", 404)
  }

  ensureFileOwnership(file, user);  

  const newFileName = originalName.trim();

  if (file.original_name === newFileName) {
    return {
      success: true,
      message: "No changes made",
    };
  }

  const updateFile = await updateFileNameRepository(newFileName, fileId);

  if (!updateFile) {
    throw new AppError("File not found", 404);
  }

  return {
    success: true,
    message: "File renamed successfully",
    file: updateFile,
  };
}
