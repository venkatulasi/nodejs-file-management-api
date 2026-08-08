import { AppError } from "../errors/AppErrors.js";

export function validateFileId(req, res, next) {

    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <=0){
        throw new AppError("Invalid file Id", 400);
    }

    next();    
}