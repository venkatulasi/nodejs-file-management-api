import {
  listFiles,
  uploadFile as uploadFileService,
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

export async function uploadFile(req, res) {

  console.log("controller file", req.file)
  console.log("controller file", req.body)
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
