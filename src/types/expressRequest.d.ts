import { UserDBType } from "../repositories/db";

// расширение интерфейса Request из express
// для того, чтобы можно было вставить в
// реквест доп данные (юзера например)
declare global {
    declare namespace Express {
        export interface Request {
            user: UserDBType | null;
        }
    }
}
