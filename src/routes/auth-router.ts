import express, { Request, Response } from "express";
import { userService } from "../domain/users-service";
import { UserDBType } from "../repositories/db";
import { HTTP_CODES } from "../http-codes";
import { jwtService } from "../application/jwt-service";

export function getAuthRouter() {
    const router = express.Router();

    router.post("/login", async (req: Request, res: Response) => {
        /**
         * null - юзер не найден, или не совпадает пароль
         * UserDBType - юзер найден, пароль подходит
         */
        const user: UserDBType | null =
            await userService.checkCredentials(
                req.body.loginOrEmail,
                req.body.password
            );

        if (user) {
            const token = await jwtService.createJWT(user);
            const test = await jwtService.getUserIdByToken(token);
            console.log(test);
            
            res.status(HTTP_CODES.CREATED_201).send(token);
        } else {
            res.sendStatus(HTTP_CODES.UNAUTHORIZED_401);
        }
    });
    return router;
}
