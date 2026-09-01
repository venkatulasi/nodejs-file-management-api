export function getAuditContext(req) {
  return {
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
    requestId: req.requestId,
  };
}