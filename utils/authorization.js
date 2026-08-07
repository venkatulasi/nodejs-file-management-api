import { AppError } from "../errors/AppErrors.js";

export function ensureFileOwnership(file, user) {

    if(user.role === "admin"){
        return;
    }

    if(file.user_id !== user.id){
        throw new AppError("Forbidden",403);
    }
    
}