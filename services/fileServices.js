import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { AppError } from "../errors/AppErrors.js";
import {
  uploadFile as uploadFileRipository,
  getFiles as getFilesRepository,
  getFilesCount as getFilesCountRepository,
  getFileByIdRepository,
  updateFileNameRepository,
  softDeleteFileRepository,
} from "../repositories/fileRepository.js";
import { ensureFileOwnership } from "../utils/authorization.js";
import { recordAuditLog } from "./audit.service.js";
import { pool } from "../database/db.js";
import { createAuditLog } from "../repositories/audit.repository.js";
import logger from "../logger/logger.js";
import { validateFileName } from "../utils/validators.js";

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

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const createdFile = await uploadFileRipository(file, userId, client);

    await createAuditLog({
      userId: userId,
      action: "FILE_UPLOADED",
      resourceType: "file",
      resourceId: createdFile.id,
      metadata: {
        file_name: createdFile.original_name,
        stored_name: createdFile.stored_name,
      }
    },
    client
  );

   await client.query("COMMIT");

   return {
    success: true,
    message: "File uploaded successfully",
    file: createdFile
   }

  } catch (error) {
    await client.query("ROLLBACK");

    try {
      await fs.unlink(file.path);  
    } catch (unlinkError) {
      logger.error("Failed to remove uploaded file",{
        error: unlinkError,
        path: file.path,
      })
    }
    throw error;    
  }finally{
    client.release();
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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const deleteFile = await softDeleteFileRepository(file.id, client);

    if (!deleteFile) {
      throw new AppError("File not found", 404);
    }

    await recordAuditLog(
      {
        userId: user.id,
        action: "FILE_DELETED",
        resourceType: "file",
        resourceId: id,
        metadata: {
          file_name: file.original_name,
        },
      },
      client,
    );

    await client.query("COMMIT");

    return {
      success: true,
      message: "File deleted successfully",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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

  await createAuditLog({
    userId: user.id,
    action: "FILE_DOWNLOADED",
    resourceType: "file",
    resourceId: fileId,
    metadata: {
      file_name: file.original_name
    }
  })

  return file;
}

export async function renameFileService(originalName, fileId, user) {
  const file = await getFileByIdRepository(fileId);

  if (!file) {
    throw new AppError("File not found", 404);
  }

  if (file.is_deleted) {
    throw new AppError("File already deleted", 404);
  }

  ensureFileOwnership(file, user);

  const newFileName = validateFileName(originalName);

  if (file.original_name === newFileName) {
    return {
      success: true,
      message: "No changes made",
    };
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updatedFile = await updateFileNameRepository(newFileName, fileId, client);

    if (!updatedFile) {
      throw new AppError("File not found", 404);
    }

    await recordAuditLog(
      {
        userId: user.id,
        action: "FILE_RENAMED",
        resourceType: "file",
        resourceId: fileId,
        metadata: {
          old_name: file.original_name,
          new_name: newFileName,
        },
      },
      client,
    );

    await client.query("COMMIT");

    return {
      success: true,
      message: "File renamed successfully",
      file: updatedFile,
    };

    
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
