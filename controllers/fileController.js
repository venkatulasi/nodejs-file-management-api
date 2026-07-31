import {
  listFiles,
  readContent,
  uploadFile as uploadFileService,
  updateFile as updateFileService,
  deleteFile as deleteFileService,
} from "../services/fileServices.js";

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
  });
  res.json(files);
}

export async function getFile(req, res) {
  const fileName = req.params.fileName;
  const content = await readContent(fileName);
  res.json(content);
}

export async function uploadFile(req, res) {

  await uploadFileService(req.file);

  res.status(201).json({
    message: "File uploaded successfully",
  });
}

export async function deleteFile(req, res) {
  const id = req.params.id;

  await deleteFileService(id);
  res.status(200).json({
    message: "File deleted successfully",
  });
}
