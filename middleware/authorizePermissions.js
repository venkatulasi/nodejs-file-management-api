import { ROLE_PERMISSIONS } from "../config/permissions.js";
import { AppError } from "../errors/AppErrors.js";

export function authorizePermission(permission) {
    return (req, res, next) => {
        if(!req.user){
            throw new AppError("Authorization required",401);
        }

        const permissions = ROLE_PERMISSIONS[req.user.role] || [];

        if(!permissions.includes(permission)){
            throw new AppError("Access denied",403);
        }

        next();
    };    
}