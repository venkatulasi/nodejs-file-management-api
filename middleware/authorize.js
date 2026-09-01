import { AppError } from "../errors/AppErrors.js"

export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {

        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }

        if(!allowedRoles.includes(req.user.role)){
            throw new AppError("Access denied",403);
        }

        next();
    }
}