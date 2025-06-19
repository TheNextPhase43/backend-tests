import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HTTP_CODES } from "../http-codes";

export const inputValidationMiddleWare = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(HTTP_CODES.BAD_REQUEST_400).json({
            errors: errors.array(),
        });
    } else {
        next();
    }
};
