import { createAuditLog } from "../repositories/audit.repository.js";

export async function recordAuditLog(
  {
    userId,
    action,
    resourceType,
    resourceId,
    metadata,
    ipAddress,
    userAgent,
    requestId,
  },
  client,
) {
  return createAuditLog(
    {
      userId,
      action,
      resourceType,
      resourceId,
      metadata,
      ipAddress,
      userAgent,
      requestId,
    },
    client,
  );
}
