import { AppError } from "../errors/AppErrors";

export function validateRenameFile(req, res, nex){
    const {original_name} = req.body;
    const fileName = original_name.trim();
    
    if (original_name === undefined) {
    throw new AppError("File name is required", 400);
}

    if(typeof original_name !== "string"){
        throw new AppError("File name must be text",400)
    }

    if(!original_name.trim()){
        throw new AppError("File name cannot be empty", 400);
    }
    if(original_name.length > 255 ){
        throw new AppError("File name should be at most 255 characters",400);
    }

    next();
}