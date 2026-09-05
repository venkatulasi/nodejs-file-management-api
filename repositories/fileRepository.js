import { pool } from "../database/db.js";
import { handleDatabaseError } from "../errors/databaseError.js";

//Create
export async function uploadFile(file, userId, client) {
  const query = `
      INSERT INTO files(
              original_name, 
              stored_name,
              path,
              mime_type,
              size,
              user_id
      ) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, original_name, stored_name
      `;

  const values = [
    file.originalname,
    file.filename,
    file.path,
    file.mimetype,
    file.size,
    userId,
  ];

  try {
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw handleDatabaseError(error);
  }
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
  userId,
}) {
  let query = `SELECT 
                id,
                original_name,
                created_at 
              FROM files`;
  const values = [];
  const conditions = ["is_deleted = FALSE"];

  if (userId !== null && userId !== undefined) {
    conditions.push(`user_id = $${values.length + 1}`);
    values.push(userId);
  }
  if (search) {
    conditions.push(`original_name ILIKE $${values.length + 1}`);
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

  query += ` ORDER BY ${sort} ${order}`;

  query += ` LIMIT $${values.length + 1}`;

  values.push(limit);

  query += ` OFFSET $${values.length + 1}`;

  values.push(offset);

  const result = await pool.query(query, values);
  return result.rows;
}

export async function getFilesCount({ search, fromDate, toDate, userId }) {
  let query = `SELECT 
                COUNT(*) AS total
              FROM files`;

  const values = [];
  const conditions = ["is_deleted = FALSE"];

  if (userId !== null) {
    conditions.push(`user_id = $${values.length + 1}`);
    values.push(userId);
  }
  if (search) {
    conditions.push(`original_name ILIKE $${values.length + 1}`);
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

export async function getFileByIdRepository(fileId) {
  const query = `
    SELECT 
      original_name,
      stored_name,
      path,
      mime_type,
      size,
       user_id,
      is_deleted,
      deleted_at
    FROM files
    WHERE id = $1
  `;

  
    const result = await pool.query(query, [fileId]);

    return result.rows[0] || null;
  
}

export async function updateFileNameRepository(originalName, fileId, client) {
  const query = `
    UPDATE files
    SET original_name = $1
    WHERE id = $2
    RETURNING id, original_name
  `;

  try {
    const result = await client.query(query, [originalName, fileId]);

    return result.rows[0] || null;
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

//Delete
export async function softDeleteFileRepository(fileId, client) {
  const query = `
    UPDATE files 
    SET 
      is_deleted = TRUE,
      deleted_at = CURRENT_TIMESTAMP
    WHERE
      id = $1
      AND is_deleted = FALSE
    RETURNING id
  `;

  try {
    const result = await client.query(query, [fileId]);

    return result.rows[0] || null;
  } catch (error) {
    throw handleDatabaseError(error);
  }
}
