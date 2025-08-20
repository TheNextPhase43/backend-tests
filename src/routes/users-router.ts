import express, { Request, Response } from "express";
import { HTTP_CODES } from "../http-codes";
import { authService } from "../domain/auth-service";
import { ObjectId } from "mongodb";
import { usersService } from "../domain/users-service";

// кажется это будет переделанно, и функционал
// будет перенесён в authRouter
// upd: да, часть функций авторизации перенесена
// в auth-router, однако получение данных
// о юзерах я решил оставить здесь (логично)
export function getUsersRouter() {
    const usersRouter = express.Router();

    // usersRouter.post("/", async (req: Request, res: Response) => {
    //     const creationResult = await authService.createUser(
    //         req.body.login,
    //         req.body.email,
    //         req.body.password
    //     );

    //     // хз насколько эта логика уместна
    //     // для presentation уровня. мы получаем
    //     // ошибку от бизнес логики, и отправялем
    //     // результат
    //     res.status(
    //         creationResult !== null
    //             ? HTTP_CODES.CREATED_201
    //             : HTTP_CODES.BAD_REQUEST_400
    //     ).send(creationResult);
    // });

    /* тестовый эндпоинт получения сразу всей инфы о всех юзерах
    написал в таком стиле коммент, потому что vs code скрывает
    коммент, когда я сворачиваю закомменченный эндпоинт выше */

    usersRouter.get("/test", async (req: Request, res: Response) => {
        const allUsers = await usersService.getAllUsersTest();
        console.log(allUsers);

        res.status(HTTP_CODES.OK_200).send(allUsers);
    });

    usersRouter.get(
        "/test/:id",
        async (req: Request, res: Response) => {
            const foundUser = await authService.findUserById(
                // важное!
                new ObjectId(req.params.id)
            );

            if (!foundUser) {
                res.sendStatus(HTTP_CODES.NOT_FOUND_404);
                return;
            }

            res.status(HTTP_CODES.OK_200).send(foundUser);
        }
    );

    return usersRouter;
}
