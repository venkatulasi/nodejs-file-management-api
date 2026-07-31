import { pool } from "../database/db.js";
import { AppError } from "../errors/AppErrors.js";

//Create
export async function uploadFile(file) {
  const query = `
      INSERT INTO files(
              original_name, 
              stored_name,
              path,
              mime_type,
              size
      ) 
      VALUES ($1, $2, $3, $4, $5)`;
  const value = [
    file.originalName,
    file.storedName,
    file.path,
    file.mimeType,
    file.size,
  ];

  try {
    await pool.query(query, value);
  } catch (error) {
    if (error.code === "23505") {
      throw new AppError("File already exists.", 409);
    }
    throw error;
  }
}

export async function updateFile(fileName, content) {
  const query = `UPDATE files SET content = $2 WHERE file_name = $1`;

  const result = await pool.query(query, [fileName, content]);
  if (result.rowCount === 0) {
    return false;
  }

  return true;
}

//Delete file
export async function getFileById(id) {
  const query = `SELECT * FROM files WHERE id = $1`;
  const result = await pool.query(query, [i]);
  return result.rows[0] || null;
}

export async function deleteFile(id) {
  const query = `DELETE FROM files WHERE id = $1`;

  const result = await pool.query(query, [id]);

  return result.rowCount > 0;
}

//Read files
export async function getFiles({
  search,
  sort,
  order,
  limit,
  offset,
  fromDate,
  toDate,
}) {
  let query = `SELECT 
                id,
                file_name,
                created_at 
              FROM files`;
  const values = [];
  const conditions = [];

  if (search) {
    conditions.push(`file_name ILIKE $${values.length + 1}`);
    values.push(`%${search}%`);
  }
  if (fromDate) {
    conditions.push(`created_at >= $${values.length + 1}`);
    values.push(fromDate);
  }
  if (toDate) {
    conditions.push(`created_at <= $${values.length + 1}`);
    values.push(toDate);
  }

  if (conditions.length > 0) {
    query += `WHERE ${conditions.join(" AND ")}`;
  }

  query += ` ORDER BY ${sort} ${order}`;

  query += ` LIMIT $${values.length + 1}`;

  values.push(limit);

  query += ` OFFSET $${values.length + 1}`;

  values.push(offset);

  const result = await pool.query(query, values);
  return result.rows;
}

export async function getFilesCount({ search, fromDate, toDate }) {
  let query = `SELECT 
                COUNT(*) AS total
              FROM files`;

  const values = [];
  const conditions = [];

  if (search) {
    conditions.push(`file_name ILIKE $${values.length + 1}`);
    values.push(`%${search}%`);
  }
  if (fromDate) {
    conditions.push(`created_at >= $${values.length + 1}`);
    values.push(fromDate);
  }
  if (toDate) {
    conditions.push(`created_at <= $${values.length + 1}`);
    values.push(toDate);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  const result = await pool.query(query, values);
  return Number(result.rows[0].total);
}
