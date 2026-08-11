import path from 'path';
import { AppError } from '../errors/AppErrors.js';

const uploadDirectory = path.resolve("upload");

export function getSafeFilePath(filePath) {

    const resolvePath = path.resolve(filePath);

    if( resolvePath !== uploadDirectory && !resolvePath.startsWith(`${uploadDirectory}${path.sep}`)){
        throw new AppError("Invalid file path",400)
    }

    return resolvePath;
    
}