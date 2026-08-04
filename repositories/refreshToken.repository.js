import { pool } from "../database/db.js";

export async function createRefreshTokenRepository({userId, token, expiresAt},client = pool) {
    
    const query = `
        INSERT INTO refresh_tokens (
            user_id,
            token,
            expires_at
        )
        VALUES ( $1, $2, $3 )
    `;

    const values = [
        userId,
        token,
        expiresAt
    ];

    await client.query(query, values);
    
}

export async function getRefreshTokenRepository(token) {
    const query = `
        SELECT 
            user_id,
            token,
            expires_at
        FROM refresh_tokens
        WHERE token = $1
    `;

    const result = await pool.query(query,[token]);

    return result.rows[0] || null;

};

export async function getUserByIdRepository(id) {
    const query = `
        SELECT 
            id,
            email,
            role,
            is_active
        FROM users
        WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
}

export async function deleteRefreshTokenRepository(token, client = pool) {
    
    const query = `
        DELETE FROM refresh_tokens
        WHERE token = $1
        RETURNING id
    `;
    const result = await clinet.query(query, [token]);

    return result.rows[0] || null;
}