import { validatePositiveInteger } from "../utils/validators";

// export function createValidation(req,res,next){
//     const { fileName, content} = req.body;

//     if(!fileName || !content){
//         return res.status(400).json({
//             message: "File name and content are requried"
//         })
//     }

//     next();
// }

export function validationPagination(req, res, next) {
  const { page, limit } = req.body;

  if (page !== undefined) {
    validatePositiveInteger(page, "Page");
  }

  if (limit !== undefined) {
    validatePositiveInteger(limit, "Limit");
  }

  next();
}
