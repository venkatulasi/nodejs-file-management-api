import { pool } from "../database/db.js";

export async function getUsersRepository() {
    
    const query = `
            SELECT id, name, email, role, is_active, created_at 
            FROM users 
            ORDER BY created_at DESC
            `;
    
    const result = await pool.query(query);
    return result.rows;
}