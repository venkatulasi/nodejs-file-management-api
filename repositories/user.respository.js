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

export async function getUserPasswordRepository(userId) {

    const query = `
        SELECT password 
        FROM users
        WHERE id = $1
    `;

    const result = await pool.query(query,[userId]);
    return result.rows[0] || null;    
}

export async function updateUserPasswordRepository(userId, hashedPassword) {
    
    const query = `
        UPDATE users
        SET password = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING id
        `;
    
    const result = await pool.query(query,[
        hashedPassword,userId
    ]);
    return result.rows[0] || null;
}

export async function deleteUserRefreshTokenRepository(userId) {
    
    const query = `
        DELETE FROM refresh_tokens
        WHERE user_id = $1
    `;

    const result = pool.query(query,[userId]);    
}