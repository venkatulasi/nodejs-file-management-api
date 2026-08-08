import { AppError } from "../errors/AppErrors.js";
import { validatePositiveInteger } from "../utils/validators.js";

export function validationPagination(req, res, next) {
  const { page, limit } = req.query;
  
  if (page !== undefined) {
    validatePositiveInteger(page, "Page");
  }

  if (limit !== undefined) {
    validatePositiveInteger(limit, "Limit");
  }

  if(Number(limit) > 100){
    throw new AppError("Limit can't exceed 100.",400);
  }

  next();
}
