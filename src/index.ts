import express, { Request, Response } from "express";
import { HTTP_CODES } from "./http-codes";

export const app = express();
const port = process.env.PORT || 3003;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

export type Title = {
    id: number;
    title: string;
};

let TitlesArray: Title[] = [
    {
        id: 100,
        title: "title100",
    },
    {
        id: 200,
        title: "title200",
    },
];

// home
app.get("/", (req: Request, res: Response) => {
    res.send("<h1>Home page</h1>");
});

// get all titles
app.get("/titles", (req: Request, res: Response) => {
    if (!TitlesArray) {
        res.sendStatus(404);
    }
    res.status(200).json(TitlesArray);
});

// get title by DB id
app.get("/titles/:id", (req: Request, res: Response) => {
    const foundTitle = TitlesArray.find((el) => {
        return el.id === +req.params.id;
    });
    if (!foundTitle) {
        res.sendStatus(HTTP_CODES.NOT_FOUND_404);
        return;
    }
    res.status(HTTP_CODES.OK_200).json(foundTitle);
});

// post new title
app.post("/titles", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }

    const newTitle: Title = {
        id: +new Date(),
        title: req.body.title,
    };

    TitlesArray.push(newTitle);
    res.status(HTTP_CODES.CREATED_201).json(newTitle);
});

// delete all titles
app.delete("/titles", (req: Request, res: Response) => {
    TitlesArray = [];
    res.sendStatus(204);
});

app.listen(port, () => {
    console.log("Server started!!!");
});
