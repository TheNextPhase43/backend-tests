import { UserDBType } from "../repositories/db";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { settings } from "../settings";

export const jwtService = {
    /**
     * Передаём юзера из дб
     * получаем jwt токен
     */
    async createJWT(userToCreateToken: UserDBType) {
        const token = jwt.sign(
            // это потом станет тем, что возвращает
            // метод jwt.verify()
            // помещаем мы сюда ObjectId
            // однако потом, при извлечении,
            // он станет строкой
            { userId: userToCreateToken._id },
            settings.JWT_SECRET,
            { expiresIn: "1h" }
        );
        return token;
    },

    // метод получения чисто айдишника юзера из токена,
    // в кооторый он был раньше помещён методом createJWT
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(
                token,
                settings.JWT_SECRET
            );
            // result.userId на данный момент строка
            return new ObjectId(result.userId);
        } catch {
            return null;
        }
    },
};
