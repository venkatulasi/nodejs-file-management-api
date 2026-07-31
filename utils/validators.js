import { AppError } from "../errors/AppErrors.js";

export function validatePositiveInteger(value, fieldName) {
  if (value === "") {
    throw new AppError(`${fieldName} cannot be empty.`, 400);
  }

  if (Number.isNaN(Number(value))) {
    throw new AppError(`${fieldName} must be a number.`, 400);
  }

  if (Number(value) < 1) {
    throw new AppError(`${fieldName} must be greater than 0.`, 400);
  }
}
