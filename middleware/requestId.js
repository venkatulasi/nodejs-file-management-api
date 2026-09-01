import { randomUUID } from "crypto";

export function requestId(req, res, next) {
    const id = randomUUID();

    req.rquestId = id;
    res.setHeader("X-Request-ID", id);

    next();

}