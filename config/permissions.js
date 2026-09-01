export const ROLE_PERMISSIONS = {
  admin: [
    "user:read",
    "user:manage",
    "file:read",
    "file:upload",
    "file:rename",
    "file:delete",
  ],

  user: [
    "file:read",
    "file:upload",
    "file:rename",
    "file:delete",
  ],
};