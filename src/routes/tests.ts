import express, { Request, Response } from "express";
import { Title } from "../db/db";

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

    return router;
}
