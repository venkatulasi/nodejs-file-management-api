import { AppError } from "./AppErrors.js";

export function handleDatabaseError(error) {

    switch (error.code) {
        case "23505":
            return new AppError("A record with the same value already exists.", 409);
        
        case "23503":
            return new AppError("Referenced record does not exist.", 400);
        
        case "23502":
            return new AppError("Required database field is missing.", 400);
        
        case "22P02":
            return new AppError("Invalid data format.", 400);
        
        default:
            return error;
    }
    
}