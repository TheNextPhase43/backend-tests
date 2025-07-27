import express, { Request, Response } from "express";
import { HTTP_CODES } from "../http-codes";
import { feedbackService } from "../domain/feedback-service";
import { UserDBType } from "../repositories/db";
import { authMiddleware } from "../middlewares/auth-middleware";

export function getFeedbackRouter() {
    const router = express.Router();

    router.post(
        "/",
        // этот middleware
        // вставляется перед эндпоинтами,
        // на которых требуется проверка
        // подлинности юзера через jwt токен
        authMiddleware,
        async (
            // посколько authMiddleware
            // добавляет поле user,
            // расшиерение интерефейса
            // Request есть в файле
            // expressRequest.d.ts
            request: Request,
            response: Response
        ) => {
            // айди мы не провряем, так как если его нет,
            // то это вскроется ещё в authMiddleware
            if (!request.body.comment) {
                response.sendStatus(HTTP_CODES.BAD_REQUEST_400);
                return;
            }

            const createdFeedbackElement =
                await feedbackService.createFeedbackElement(
                    request.body.comment,
                    // поле user добавлено
                    // authMiddleware
                    request.user!._id
                );

            response
                .status(HTTP_CODES.CREATED_201)
                .send(createdFeedbackElement);
        }
    );

    router.get("/", async (request: Request, response: Response) => {
        const allFeedback = await feedbackService.getAllFeedback();

        response.status(HTTP_CODES.OK_200).send(allFeedback);
    });

    return router;
}
