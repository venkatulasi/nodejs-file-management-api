import { AppError } from "../errors/AppErrors.js";

export function validatePositiveInteger(value, fieldName) {
  if (value === "") {
    throw new AppError(`${fieldName} cannot be empty.`, 400);
  }

  const number = Number(value);

  if (!Number.isNaN(Number(number))) {
    throw new AppError(`${fieldName} must be a positive number.`, 400);
  }

  if (number < 1) {
    throw new AppError(`${fieldName} must be greater than 0.`, 400);
  }
}

export function validateFileName(value) {
  
  if(typeof value !== "string"){
    throw new AppError("File name must be string.", 400);
  }

  const fileName = value.trim();

  if(!fileName){
    throw new AppError("File name cannot be empty.", 400);
  }

  if(fileName.length > 255){
    throw new AppError("File name cannot exceed 255 characters.", 400)
  }

  if(fileName.includes("/") || fileName.includes("\\")){
    throw new AppError(
      "File name cannot contain path separators.",
      400
    );
  }

  return fileName
}