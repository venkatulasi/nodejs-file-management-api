import {
  listFiles,
  uploadFile as uploadFileService,
  softDeleteFileService,
  downloadFileService,
  renameFileService,
} from "../services/fileServices.js";
import fs from "fs";
import path from "path";

export async function getFiles(req, res) {
  const { page, limit, search, sort, order, fromDate, toDate } = req.query;
  const files = await listFiles({
    page,
    limit,
    search,
    sort,
    order,
    fromDate,
    toDate,
  },
  req.user
);
  res.json(files);
}

export async function uploadFile(req, res) {
  await uploadFileService(req.file, req.user.id);

  res.status(201).json({
    message: "File uploaded successfully",
  });
}

export async function deleteFile(req, res) {
  const { id } = req.params.id;

  const result = await softDeleteFileService(id,req.user);

  res.status(200).json(result);
}

export async function downloadFile(req, res) {
  const { id } = req.params;

  const file = await downloadFileService(id, req.user);

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${file.original_name}"`,
  );

  res.setHeader("Content-Type", file.mime_type);

  const stream = fs.createReadStream(path.resolve(file.path));

  stream.on("error", (err) => {
    console.error(err);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "File download failed",
      });
    }
    res.end();
  });

  stream.pipe(res);
}

export async function renameFile(req, res) {

  const { id } = req.params;
  const { original_name } = req.body;

  const result = await renameFileService(original_name,id,req.user);
  
  return res.status(200).json(result);
}