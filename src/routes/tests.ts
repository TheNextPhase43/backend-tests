import express, { Request, Response } from "express";
import { Title } from "../repositories/titles-repository";

const testData = {
    data: "data77",
};

export function getTestsRouter(TitlesArray: Title[]) {
    const router = express.Router();
    // delete all titles
    router.delete("/titles", (req: Request, res: Response) => {
        TitlesArray.length = 0;
        res.status(200).send(TitlesArray);
    });

    router.get("/titles", (req: Request, res: Response) => {
        res.status(200).json(TitlesArray);
    });

    router.get("/admin", (req: Request, res: Response) => {
        // спойлер к authorization header: 'admin:qwerty'
        // if пароль совпадает с нужным тут, то
        // отдаём нужные данные, иначе в бан и 401 код
        // res.status(200).json(testData);
        res.status(200).json({
            authHeader: req.headers.authorization,
        });
    });

    return router;
}
