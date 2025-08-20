import { NextFunction, Request, Response } from "express";
import { jwtService } from "../application/jwt-service";
import { HTTP_CODES } from "../http-codes";
import { UserAccountInDBType } from "../repositories/db";
import { ObjectId } from "mongodb";
import { authService } from "../domain/auth-service";

/**
 * Данный middleware проверяет
 * подлинность jwt токена
 */
export const authMiddleware = async (
    request: Request & {
        user?: UserAccountInDBType | null;
    },
    response: Response,
    next: NextFunction
) => {
    // нет токена - нет авторизации
    if (!request.headers.authorization) {
        response.sendStatus(HTTP_CODES.UNAUTHORIZED_401);
        return;
    }

    // поле authorization выглядит примерно так:
    // "bearer *hash*"
    // поэтому мы берём сам хеш
    const token = request.headers.authorization.split(" ")[1];
    // вот тут как раз проверка подлинности токена
    // если ок - вернёт айди юзера из самого же токена
    // если нет - null
    const userId = await jwtService.getUserIdByToken(token);

    if (userId) {
        request.user = await authService.findUserById(userId);
        next();
        // тут была проблема, которую я долго решал
        // return должен быть обязательно, чтобы
        // выйти из middleware, иначе срабатывала
        // отправка статуса ниже, что стопорило
        // последующий ответ сервера, уже вне
        // middleware
        return;
    }

    // если же такого айди юзера нет, то
    response.sendStatus(HTTP_CODES.UNAUTHORIZED_401);
    return;
};
