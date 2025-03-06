import express, { Request, Response } from "express";
import { getInterestingRouter, getTitlesRouter } from "./routes/titles";
import { TitlesArray } from "./db/db";
import { getTestsRouter } from "./routes/tests";

export const app = express();
export const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const titlesRouter = getTitlesRouter(TitlesArray);
const testsRouter = getTestsRouter(TitlesArray);
const interestingRouter = getInterestingRouter();
app.use("/__test__", testsRouter);
app.use("/titles", titlesRouter);
app.use("/interesting", interestingRouter);

// home
app.get("/", (req: Request, res: Response) => {
    res.send("<h1>Home page</h1>");
});
