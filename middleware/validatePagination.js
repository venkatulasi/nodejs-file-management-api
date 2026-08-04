import { validatePositiveInteger } from "../utils/validators.js";

export function validationPagination(req, res, next) {
  const { page, limit } = req.query;
  
  if (page !== undefined) {
    validatePositiveInteger(page, "Page");
  }

  if (limit !== undefined) {
    validatePositiveInteger(limit, "Limit");
  }

  next();
}
