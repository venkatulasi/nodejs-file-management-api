import { pool } from "../database/db.js";
import { AppError } from "../errors/appErrors.js";

export async function createFile(fileName, content) {
  const query = `INSERT INTO files(file_name, content) VALUES ($1, $2)`;

  try {
    await pool.query(query, [fileName, content]);
  } catch (error) {
    if (error.code === "23505") {
      throw new AppError("File already exists.", 409);
    }
    throw error;
  }
}

export async function getFile(fileName) {
  const query = `SELECT id,file_name,content FROM files WHERE file_name = $1`;

  const result = await pool.query(query, [fileName]);
  return result.rows[0] || null;
}

export async function updateFile(fileName, content) {
  const query = `UPDATE files SET content = $2 WHERE file_name = $1`;

  const result = await pool.query(query, [fileName, content]);
  if (result.rowCount === 0) {
    return false;
  }

  return true;
}

export async function deleteFile(fileName) {
  const query = `DELETE FROM files WHERE file_name = $1`;

  const result = await pool.query(query, [fileName]);
  if (result.rowCount === 0) {
    return false;
  }

  return true;
}

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
