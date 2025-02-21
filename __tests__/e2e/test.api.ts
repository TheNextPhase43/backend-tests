import request from "supertest";
import { app } from "../../src/index";
import { HTTP_CODES } from "../../src/http-codes";

describe("/title", () => {
    // очистка бд
    // хорошая ли практика?
    beforeAll(async () => {
        await request(app).delete("/titles");
    });

    let createdTitle1: any = null;
    let createdTitle2: any = null;

    it("should return 200 code and empty array", async () => {
        await request(app).get("/titles").expect(200, []);
    });

    it("should return 201 code and created title", async () => {
        // новая запись в бд
        createdTitle1 = "title999";

        // отправка записи на бэк,
        // проверка http-кода
        // postResponse - ответ
        const postResponse = await request(app)
            .post("/titles")
            .send({ title: createdTitle1 })
            .expect(HTTP_CODES.CREATED_201);

        // проверка совпадения ответа по
        // формату хранения в бд
        // postResponse.body - сам массив
        // из бд
        expect(postResponse.body).toEqual({
            id: expect.any(Number),
            title: createdTitle1,
        });

        // проверка гет-запросом
        const getResponse = await request(app)
            .get("/titles")
            .expect(200);

        // тест проходит только если полученный массив от
        // бэка содержит отправленный ему title
        expect(getResponse.body).toEqual(
            expect.arrayContaining([postResponse.body])
        );
    });
    // по факту этот, и следующий тесты похожи,
    // сначала постим что-то, потом проверяем
    // появилось ли оно в БД get запросом,
    // просто в следующем тесте идёт проверка
    // не post запроса (проверка функционала
    // самого post), а проверка получения
    // get по id (обособленно сделать запрос по
    // id без предварительного созданяи не
    // получается, так как мы можем не иметь
    // данных из БД, а конкретно id)

    // т.к. мы не можем просто взять и запросить
    // какой либо title по id (можем не знать id)
    // сначала создаём новый title в DB post запросом,
    // затем имея его данные полученные в ответ от бэка
    // ещё в post запросе, посылаем запрос get с URI
    // параметром ID
    it("should return 201 code and object found by DB id", async () => {
        createdTitle2 = "title1000";

        const postResponse = await request(app)
            .post("/titles")
            .send({ title: createdTitle2 })
            .expect(HTTP_CODES.CREATED_201);

        await request(app)
            .get(`/titles/${postResponse.body.id}`)
            .expect(HTTP_CODES.OK_200, postResponse.body);
    });
});
