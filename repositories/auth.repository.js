import { pool } from "../database/db.js";
import { AppError } from "../errors/AppErrors.js";

export async function getUserByEmailRepository(email) {
  const query = `
        SELECT id 
        FROM users
        WHERE email = $1`;

  const result = await pool.query(query, [email]);

  return result.rows[0] || null;
}

export async function getUserForLoginRepository(email) {
  const query = `
        SELECT 
            id,
            email,
            password,
            role,
            is_active
        FROM users
        WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0] || null;
}

export async function createUserRepositroy({ name, email, password }) {
  const query = `
        INSERT INTO users(
            name,
            email,
            password
        )
        VALUES ($1, $2, $3)
        RETURNING id, name, email, role, is_active, created_at 
    `;
  const values = [name, email, password];
  try {
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    if (error.code === "23505") {
      throw new AppError("Email already exists", 409);
    }
    throw error;
  }
}
