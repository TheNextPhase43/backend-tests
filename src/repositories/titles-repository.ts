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

    findTitleById(id: number) {
        const foundTitle = TitlesArray.find((el) => {
            return el.id === id;
        });
        return foundTitle;
    },

    createTitle(title: string) {
        const newTitle: Title = {
            id: +new Date(),
            title: title,
            length: 30,
        };

        TitlesArray.push(newTitle);
        return newTitle;
    },

    updateTitle(id: number, newTitle: string) {
        const foundTitle = TitlesArray.find((el) => el.id === id);

        if (!foundTitle) {
            return null;
        } else {
            foundTitle.title = newTitle;
            return foundTitle;
        }
    },

    deleteTitle(id: number) {
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
