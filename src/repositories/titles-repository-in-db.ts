import { mongoDbTitlesCollection } from "./db";
import { Title } from "./db";

export const titlesRepository = {
    // возвращает все titles, или по самому
    // значению title
    async findTitles(
        title?: string | null | undefined
    ): Promise<Title[]> {
        const filter: any = {};
        if (title) {
            filter.title = { $regex: title };
            // первый запрос к бдшке в моей жизни,
            // пока не очень понятно, но тут у нас есть
            // return (
            //     client
            //         // обращение к бд по имени
            //         .db("TitlesDataBase")
            //         // нужная коллекция в бд с типизацией
            //         .collection<Title>("titles")
            //         // ищем по параметру совпадения у
            //         // элемента title с тем, что передали
            //         .find({ title: { $regex: title } })
            //         // превращение в массив (пока временно)
            //         .toArray()
            // );
        }
        // фильтруем через объект { title: something } или { }
        return mongoDbTitlesCollection.find(filter).toArray();
    },

    // вернёт тайтл или андефайнед, потому что может и не найтись такой тайтл
    async findTitleById(id: number): Promise<Title | null> {
        const foundTitle: Title | null =
            await mongoDbTitlesCollection.findOne({ id: id });
        return foundTitle;
    },

    async createTitle(newTitle: Title): Promise<Title> {
        await mongoDbTitlesCollection.insertOne(newTitle);
        return newTitle;
    },

    async updateTitle(
        id: number,
        newTitle: string
    ): Promise<boolean> {
        const result = await mongoDbTitlesCollection.updateOne(
            { id: id },
            { $set: { title: newTitle } }
        );

        if (result.matchedCount === 1) {
            return true;
        } else {
            return false;
        }
    },

    async deleteTitle(id: number): Promise<true | false> {
        const result = await mongoDbTitlesCollection.deleteOne({
            id: id,
        });
        return result.deletedCount === 1;
    },
};
