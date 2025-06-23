// репозиторий работает с памятью!
// без mongodb и других бд

export type Title = {
    id: number;
    title: string;
    length: number;
};

export let TitlesArray: Title[] = [
    {
        id: 100,
        title: "title100",
        length: 10,
    },
    {
        id: 200,
        title: "title200",
        length: 20,
    },
];

export const titlesRepository = {
    // возвращает все titles, или по самому
    // значению title
    async findTitles(
        title?: string | null | undefined
    ): Promise<Title[]> {
        // по идее тут должна быть работа не
        // стандартного js, пока что оно всё равно
        // виснет. Надо тестить...
        // const start = performance.now();
        // console.log(start);
        // while (performance.now() - start < 3000) {
        //     console.log(performance.now() - start);
        // }

        let foundTitles = TitlesArray;
        // поиск по query-параметру совпадений
        if (title) {
            foundTitles = TitlesArray.filter((el) => {
                return el.title.indexOf(title) > -1;
            });
        }

        // if (!foundTitles) {
        //     return null;
        // }

        return foundTitles;
    },

    // вернёт тайтл или андефайнед, потому что может и не найтись такой тайтл
    async findTitleById(id: number): Promise<Title | undefined> {
        const foundTitle = TitlesArray.find((el) => {
            return el.id === id;
        });
        return foundTitle;
    },

    async createTitle(title: string): Promise<Title> {
        const newTitle: Title = {
            id: +new Date(),
            title: title,
            length: 30,
        };

        TitlesArray.push(newTitle);
        return newTitle;
    },

    async updateTitle(id: number, newTitle: string): Promise<Title | null> {
        const titleToUpdate = TitlesArray.find((el) => el.id === id);

        if (!titleToUpdate) {
            return null;
        } else {
            titleToUpdate.title = newTitle;
            return titleToUpdate;
        }
    },

    async deleteTitle(id: number): Promise<true | false> {
        TitlesArray.forEach((el, i) => {
            if (el.id === id) {
                TitlesArray.splice(i, 1);
                return true;
            }
        });
        return false;
        // можно и так, но так вернуть
        // true/false сложнее
        // TitlesArray = TitlesArray.filter((el) => {
        //     return el.id !== id;
        // });
    },
};
