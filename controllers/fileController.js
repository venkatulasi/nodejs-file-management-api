import {
  listFiles,
  readContent,
  createFile as createFileService,
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

export async function createFile(req, res) {
  const { fileName, content } = req.body;

  await createFileService(fileName, content);

  res.status(201).json({
    message: "File created successfully",
  });
}

export async function updateFile(req, res) {
  const { content } = req.body;
  const fileName = req.params.fileName;
  await updateFileService(fileName, content);
  res.status(200).json({
    message: "File successfully updated",
  });
}

export async function deleteFile(req, res) {
  const fileName = req.params.fileName;

  await deleteFileService(fileName);
  res.status(200).json({
    message: "File deleted successfully",
  });
}
