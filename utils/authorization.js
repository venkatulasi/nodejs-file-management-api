import { AppError } from "../errors/AppErrors.js";

export function ensureFileAccess(file, user) {
    if(!file){
        throw AppError("File not found",404)
    }

    if(user.role === "admin"){
        return;
    }

    if(file.user_id !== user.id){
        throw new AppError("Access denied",403);
    }
    
}