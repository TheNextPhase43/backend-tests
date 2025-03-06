import { Express, Request, Response } from "express";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithQuery,
} from "../expressRequestTypes";
import { QueryTitleModel } from "../models/QueryTitleModel";
import { TitleViewModel } from "../models/TitleViewModel";
import { URIParamsTitleIdModel } from "../models/URIParamsTitleIdModel";
import { CreateTitleModel } from "../models/CreateTitleModel";
import { HTTP_CODES } from "../http-codes";
import { UpdateTitleMode } from "../models/UpdateTitleMode";
import { Title } from "../db/db";
import express from "express";

export function getViewTitleModel(Title: Title): TitleViewModel {
    return {
        id: Title.id,
        title: Title.title,
    };
}

export function getTitlesRouter(TitlesArray: Title[]) {
    const router = express.Router();

    // при переносе в отдельный роутер
    // функция beforeAll в jest не
    // срабатывает, или срабатывает не
    // корректно, и DB не очищается перед
    // каждым запуском
    // router.delete("/", (req: Request, res: Response) => {
    //     TitlesArray = [];
    //     res.status(200).send(TitlesArray);
    // });

    // get all titles / select by query
    router.get(
        "/",
        (
            req: RequestWithQuery<QueryTitleModel>,
            res: Response<TitleViewModel[]>
        ) => {
            let titlesToResponse = TitlesArray;

            // поиск по query-параметру совпадений
            if (req.query.title) {
                titlesToResponse = TitlesArray.filter((el) => {
                    return el.title.indexOf(req.query.title) > -1;
                });
            }

            if (!titlesToResponse) {
                res.sendStatus(404);
            }

            res.status(200).json(
                titlesToResponse.map(getViewTitleModel)
            );
        }
    );

    // get title by DB id
    router.get(
        "/:id",
        (
            req: RequestWithParams<URIParamsTitleIdModel>,
            res: Response<TitleViewModel>
        ) => {
            const foundTitle = TitlesArray.find((el) => {
                return el.id === +req.params.id;
            });
            if (!foundTitle) {
                res.sendStatus(HTTP_CODES.NOT_FOUND_404);
                return;
            }
            res.status(HTTP_CODES.OK_200).json(
                getViewTitleModel(foundTitle)
            );
        }
    );

    // post new title
    router.post(
        "/",
        (
            req: RequestWithBody<CreateTitleModel>,
            res: Response<TitleViewModel>
        ) => {
            if (!req.body.title) {
                res.sendStatus(400);
                return;
            }

            const newTitle: Title = {
                id: +new Date(),
                title: req.body.title,
                length: 30,
            };

            TitlesArray.push(newTitle);
            res.status(HTTP_CODES.CREATED_201).json(
                getViewTitleModel(newTitle)
            );
        }
    );

    router.put(
        "/:id",
        (
            req: Request<URIParamsTitleIdModel, {}, UpdateTitleMode>,
            res: Response<TitleViewModel>
        ) => {
            if (!req.body.title) {
                res.sendStatus(HTTP_CODES.BAD_REQUEST_400);
                return;
            }
            const foundTitle = TitlesArray.find(
                (el) => el.id === +req.params.id
            );

            if (!foundTitle) {
                res.sendStatus(HTTP_CODES.NOT_FOUND_404);
                return;
            }

            foundTitle.title = req.body.title;
            res.status(HTTP_CODES.OK_200).json(foundTitle);
        }
    );

    // delete by id
    router.delete(
        "/:id",
        (
            req: RequestWithParams<URIParamsTitleIdModel>,
            res: Response
        ) => {
            TitlesArray = TitlesArray.filter((el) => {
                return el.id !== +req.params.id;
            });
            res.sendStatus(HTTP_CODES.NO_CONTENT_204);
        }
    );

    return router;
}

// мини тест регулярки и условностей express
// порядка выбора endpoint
export function getInterestingRouter() {
    const router = express.Router();

    router.get(
        "/books",
        (
            req: RequestWithQuery<QueryTitleModel>,
            res: Response<{ title: string }>
        ) => {
            res.status(200).json({ title: "books" });
        }
    );

    router.get(
        "/:id(\\d+)",
        (
            req: RequestWithParams<URIParamsTitleIdModel>,
            res: Response<{ id: string }>
        ) => {
            res.status(HTTP_CODES.OK_200).json({
                id: "data by id: " + req.params.id,
            });
        }
    );

    return router;
}
