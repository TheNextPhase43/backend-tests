import express, { Request, Response } from "express";
import {
    getInterestingRouter,
    getTitlesRouter,
} from "./routes/titles";
// import { TitlesArray } from "./db/db";
import { TitlesArray } from "./repositories/titles-repository";
import { getTestsRouter } from "./routes/tests";
import { getUsersRouter } from "./routes/users-router";
import { getAuthRouter } from "./routes/auth-router";
import { getFeedbackRouter } from "./routes/feedback-router";
import { getEmailRouter } from "./routes/email-router";

export const app = express();
export const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const titlesRouter = getTitlesRouter(TitlesArray);
const testsRouter = getTestsRouter(TitlesArray);
const interestingRouter = getInterestingRouter();
const usersRouter = getUsersRouter();
const authRouter = getAuthRouter();
const feedbackRouter = getFeedbackRouter();
const emailRouter = getEmailRouter();

app.use("/__test__", testsRouter);
app.use("/titles", titlesRouter);
app.use("/interesting", interestingRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/feedback", feedbackRouter);
app.use("/email", emailRouter);

// home
app.get("/", (req: Request, res: Response) => {
    res.send("<h1>Home page</h1>");
});
