import { pool } from "../database/db.js";



export async function createAuditLog({
  userId,
  action,
  resourceType,
  resourceId,
  metadata,
  ipAddress,
  userAgent,
  requestId,
},client =  pool) {
  const query = `
        INSERT INTO audit_logs(
            user_id,
            action,
            resource_type,
            resource_id,
            metadata,
            ip_address,
            user_agent,
            request_id
        ) 
        VALUES ($1, $2, $3, $4, $5. $6, $7, $8)
        RETURNING id, created_at
    `;

  const values = [userId, action, resourceType, resourceId, metadata, ipAddress, userAgent, requestId];

  const result = await client.query(query, values);

  return result.rows[0];
}
