import express, { Request, Response } from "express";
import { emailAdapter } from "../adapters/email-adapter";
import { emailService } from "../domain/email-service";

export function getEmailRouter() {
    const router = express.Router();

    router.post(
        "/send",
        async (request: Request, response: Response) => {
            // в данном конкретном случае мы обращаемся из
            // presentation layer сразу в data access (условный)
            // (условный потому что это явно не просто бизнес
            // логика, но и не роутер, а скорее база данных)
            // но вообще то для этого есть специальный email-manager,
            // вызов которого предполагается из других элементов
            // бизнес-логики и/или presentation (важно!)
            // в качестве примера места вызова есть email-service,
            // однако скорее всего таких мест может быть несколько,
            // и ответственны они могут быть за разное (recovery
            // service например, или что-то подобное)
            const emailSendResult = await emailAdapter.sendEmail(
                request.body.email,
                request.body.subject,
                `<h1 style="color: red; background-color: whitesmoke;">${request.body.text}</h1>`
            );

            response.send(emailSendResult);
        }
    );

    return router;
}
