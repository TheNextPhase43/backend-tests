const users: userType[] = [
    {
        id: "dsdf-sdfs-23",
        name: "dmitry",
        age: "34",
    },
    {
        id: "0sac3-1d1s-21",
        name: "artem",
        age: "19",
    },
    {
        id: "csdc3-ddfs-11",
        name: "ivan",
        age: "30",
    },
    {
        id: "dsdc1-dwfs-31",
        name: "ignat",
        age: "20",
    },
    {
        id: "6sac3-1d1s-21",
        name: "artem",
        age: "21",
    },
    {
        id: "6sac3-1d1s-21",
        name: "artem",
        age: "20",
    },
    {
        id: "6sac3-1d1s-21",
        name: "artem",
        age: "22",
    },
    {
        id: "6sac3-1d1s-21",
        name: "artem",
        age: "23",
    },
    {
        id: "1sac3-1d1s-21",
        name: "artem",
        age: "19",
    },
    {
        id: "9sac3-1d1s-21",
        name: "artem",
        age: "19",
    },
    {
        id: "3sac3-1d1s-21",
        name: "artem",
        age: "19",
    },
];

users.push({
    id: "qsdf2-sdfs-23",
    name: "kolya",
    age: "22",
});

type userType = {
    id: string;
    name: string;
    age: string;
};

type SortedBy<T> = {
    fieldName: keyof T;
    direction: "asc" | "desc";
};

function getSortedItems<T>(items: T[], ...sortBy: SortedBy<T>[]) {
    return [...items].sort((item1, item2) => {
        for (let sortConfig of sortBy) {
            // для выставления item1 в начало
            if (
                // a < b, значит условие сработает
                item1[sortConfig.fieldName] <
                item2[sortConfig.fieldName]
            ) {
                // зависит от того, как передали, так и будет
                // последовательность идти
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            // для выставления item2 в начало
            if (
                // b > a, значит условие сработает
                item1[sortConfig.fieldName] >
                item2[sortConfig.fieldName]
            ) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
        }
        // равенство
        return 0;
    });
}

console.log(
    getSortedItems(
        users,
        // по итогу сортироваться будет
        // сначала по алфавиту имён
        // потом алфавитные по возрасту
        // и уже одинаковые имена и возраста
        // по айди
        {
            fieldName: "name",
            direction: "asc",
        },
        {
            fieldName: "age",
            direction: "asc",
        },
        {
            fieldName: "id",
            direction: "asc",
        }
    )
);
