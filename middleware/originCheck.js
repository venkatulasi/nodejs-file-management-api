import { AppError } from "../errors/AppErrors.js";

export function originCheck(req, res, next) {

    const allowedOrigin = process.env.FRONTEND_URL;

    const origin = req.get("origin");

    if(!origin){
        return next();
    }

    if(origin !== allowedOrigin){
        throw new AppError("Forbidden origin", 403)
    }

    next();    
    
}