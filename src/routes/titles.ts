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
// import { Title } from "../db/db";
import express from "express";
import {
    titlesRepository,
    Title,
} from "../repositories/titles-repository";
import { body, validationResult } from "express-validator";
import { inputValidationMiddleWare } from "../middlewares/input-validation-middleware";

export function getViewTitleModel(Title: Title): TitleViewModel {
    return {
        id: Title.id,
        title: Title.title,
    };
}

const titleValidation = body("title").isLength({ min: 3, max: 30 });

export function getTitlesRouter(TitlesArray: Title[]) {
    const router = express.Router();

    // при переносе в отдельный роутер
    // функция beforeAll в jest не
    // срабатывает, или срабатывает не
    // корректно, и DB не очищается перед
    // каждым запуском
    // проблема решена!!! тут просто был косяк
    // с тем, что переназначать массив на другой
    // нельзя, нужно менять его длину на 0
    // router.delete("/", (req: Request, res: Response) => {
    //     TitlesArray = [];
    //     res.status(200).send(TitlesArray);
    // });

    // тест асинхронности
    // виснет всё равно если в репозитории длинная задача,
    // даже если запрос к репозиторию через await. по идее
    // оно должно останавливаться, делать другие запросы,
    // и после резолва промиса идти дальше. Но оно
    // всё равно виснет...
    router.get("/async", async (req: Request, res: Response) => {
        const foundTitles: Title[] =
            await titlesRepository.findTitles();

        // const start = performance.now();
        // console.log(start);
        // while (performance.now() - start < 10000) {
        //     console.log(performance.now() - start);
        // }

        if (!foundTitles) {
            res.sendStatus(404);
            return;
        }
        res.status(200).json(foundTitles.map(getViewTitleModel));
    });

    // get all titles / select by query
    router.get(
        "/",
        async (
            req: RequestWithQuery<QueryTitleModel>,
            res: Response<TitleViewModel[]>
        ) => {
            const foundTitlesPromise = titlesRepository.findTitles(
                req.query.title?.toString()
            );

            const foundTitles: Title[] = await foundTitlesPromise;

            if (!foundTitles) {
                res.sendStatus(404);
                return;
            }
            res.status(200).json(foundTitles.map(getViewTitleModel));
        }
    );

    // get title by DB id
    router.get(
        "/:id",
        (
            req: RequestWithParams<URIParamsTitleIdModel>,
            res: Response<TitleViewModel>
        ) => {
            const foundTitle = titlesRepository.findTitleById(
                +req.params.id
            );
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
        // вот это конкретно проверка
        // на длину переданного title
        titleValidation,
        // а вот это уже проверка на
        // наличие ошибок, которые могли
        // появится на предыдущем этапе.
        // также эта часть отправляет
        // в ответ список ошибок
        inputValidationMiddleWare,
        (
            req: RequestWithBody<CreateTitleModel>,
            res: Response<
                | TitleViewModel
                | {
                      errors: any[];
                  }
            >
        ) => {
            // if (!req.body.title.trim()) {
            //     res.sendStatus(HTTP_CODES.BAD_REQUEST_400);
            //     return;
            // }

            const newTitle = titlesRepository.createTitle(
                req.body.title
            );

            res.status(HTTP_CODES.CREATED_201).json(
                getViewTitleModel(newTitle)
            );
        }
    );

    router.put(
        "/:id",
        titleValidation,
        inputValidationMiddleWare,
        (
            req: Request<URIParamsTitleIdModel, {}, UpdateTitleMode>,
            res: Response<
                | TitleViewModel
                | {
                      errors: any[];
                  }
            >
        ) => {
            // bad request
            // if (!req.body.title) {
            //     res.sendStatus(HTTP_CODES.BAD_REQUEST_400);
            //     return;
            // }
            const updatedTitle = titlesRepository.updateTitle(
                +req.params.id,
                req.body.title
            );
            if (!updatedTitle) {
                res.sendStatus(HTTP_CODES.NOT_FOUND_404);
                return;
            }

            res.status(HTTP_CODES.OK_200).json(updatedTitle);
        }
    );

    // delete by id
    router.delete(
        "/:id",
        (
            req: RequestWithParams<URIParamsTitleIdModel>,
            res: Response
        ) => {
            const isDeleted = titlesRepository.deleteTitle(
                +req.params.id
            );
            if (isDeleted) {
                res.sendStatus(HTTP_CODES.NO_CONTENT_204);
            } else {
                res.sendStatus(HTTP_CODES.NOT_FOUND_404);
            }
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
