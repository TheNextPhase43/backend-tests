import request from "supertest";
import { app } from "../../src/app";
import { HTTP_CODES } from "../../src/http-codes";
import { CreateTitleModel } from "../../src/models/CreateTitleModel";

// тесты не переделаны под работу с mongodb
// так что пока что работают через жопу
describe("/title", () => {
    // it("should return 200 code and empty array after deletion", async () => {
    //     await request(app)
    //         .delete("/__test__/titles")
    //         .expect(200, []);
    // });
    // очистка бд (хорошая ли практика?)
    // сам по себе запрос на очистку работает
    // (выше есть запрос, и он работает)
    // но вот перед каждым другим запросом
    // функция ниже похоже не работает
    // (по идее всё срабатывает нормально и
    // DB хоть и импортится но всё равно
    // очищается). Ошибка видимо в том,
    // что из за двух роутеров и
    // примитивной DB (реально не обновляющейся
    // по факту) Функция не работает.
    // при переносе ендпоинта очистики DB
    // в роутер titles однако всё работает
    // --------------------------------------
    // проблему помогло решение перезаписывать
    // массив не пустым массивом, а
    // TitlesArray.length = 0;
    // Почему? вроде одно и тоже...
    beforeAll(async () => {
        await request(app).delete("/__test__/titles").expect(200);
    });

    it("should return 200 code and empty array", async () => {
        await request(app).get("/titles").expect(200, []);
    });

    it("should return 201 code and created title", async () => {
        // новая запись в бд
        const createdTitle1: CreateTitleModel = { title: "title999" };

        // отправка записи на бэк,
        // проверка http-кода
        // postResponse - ответ
        const postResponse = await request(app)
            .post("/titles")
            .send(createdTitle1)
            .expect(HTTP_CODES.CREATED_201);

        // проверка совпадения ответа по
        // формату хранения в бд
        // postResponse.body - сам массив
        // из бд
        expect(postResponse.body).toEqual({
            id: expect.any(Number),
            title: createdTitle1.title,
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
    it("should return 200 code and object found by DB id", async () => {
        const createdTitle2: CreateTitleModel = {
            title: "title1000",
        };

        const postResponse = await request(app)
            .post("/titles")
            .send(createdTitle2)
            .expect(HTTP_CODES.CREATED_201);

        await request(app)
            .get(`/titles/${postResponse.body.id}`)
            .expect(HTTP_CODES.OK_200, postResponse.body);
    });

    it("should'nt create new title with incorrect data and return 400 code", async () => {
        const createdTitle3: CreateTitleModel = {
            title: "",
        };

        const postResponse = await request(app)
            .post("/titles")
            .send(createdTitle3)
            .expect(HTTP_CODES.BAD_REQUEST_400);
    });

    // тест авторизации
    it("should return 200 code (auth test)", async () => {
        await request(app)
            .get("/__test__/admin")
            .set("Authorization", `admin:qwerty`)
            .expect(200, { authHeader: "admin:qwerty" });
    });
});
