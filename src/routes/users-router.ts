import express, { Request, Response } from "express";
import { HTTP_CODES } from "../http-codes";
import { userService } from "../domain/users-service";
import { ObjectId } from "mongodb";

export function getUsersRouter() {
    const usersRouter = express.Router();

    usersRouter.post("/", async (req: Request, res: Response) => {
        const creationResult = await userService.createUser(
            req.body.login,
            req.body.email,
            req.body.password
        );

        // хз насколько эта логика уместна
        // для presentation уровня. мы получаем
        // ошибку от бизнес логики, и отправялем
        // результат
        res.status(
            creationResult.hasOwnProperty("_id")
                ? HTTP_CODES.CREATED_201
                : HTTP_CODES.BAD_REQUEST_400
        ).send(creationResult);
    });

    // тестовый эндпоинт получения сразу всей инфы о всех юзерах
    usersRouter.get("/test", async (req: Request, res: Response) => {
        const allUsers = await userService.getAllUsersTest();
        console.log(allUsers);

        res.status(HTTP_CODES.OK_200).send(allUsers);
    });

    usersRouter.get(
        "/test/:id",
        async (req: Request, res: Response) => {
            const foundUser = await userService.findUserById(
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
