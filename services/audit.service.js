import { createAuditLog } from "../repositories/audit.repository.js";

export async function recordAuditLog(
  { userId, action, resourceType, resourceId, metadata },
  client,
) {
  return createAuditLog(
    {
      userId,
      action,
      resourceType,
      resourceId,
      metadata,
    },
    client,
  );
}
