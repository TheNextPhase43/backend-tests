import { titlesRepository } from "../repositories/titles-repository-in-db";
import { Title } from "../repositories/db";

// business layer
// короче прослойка между роутерами (presentation layer)
// и репозиториями (data access layer)
// нужен для доп логики, но такой, которая
// не слишком то относится конкретно к базе
// данных
export const titlesService = {
    async findTitles(
        title?: string | null | undefined
    ): Promise<Title[]> {
        return titlesRepository.findTitles(title);
    },

    async findTitleById(id: number): Promise<Title | null> {
        return titlesRepository.findTitleById(id);
    },

    async createTitle(title: string): Promise<Title> {
        // вот и первый банальный пример бизнес логики
        const newTitle: Title = {
            id: +new Date(),
            title: title,
            length: 30,
        };
        const createdProduct = await titlesRepository.createTitle(
            newTitle
        );

        return createdProduct;
    },

    async updateTitle(
        id: number,
        newTitle: string
    ): Promise<boolean> {
        return await titlesRepository.updateTitle(id, newTitle);
    },

    async deleteTitle(id: number): Promise<true | false> {
        return await titlesRepository.deleteTitle(id);
    },
};
