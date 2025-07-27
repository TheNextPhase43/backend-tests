import { ObjectId } from "mongodb";
import { UserDBType, mongoDbUsersCollection } from "./db";

export const userRepository = {
    async createUser(newUser: UserDBType) {
        await mongoDbUsersCollection.insertOne(newUser);
        return newUser;
    },

    async findUserByLoginOrEmail(loginOrEmail: string) {
        const foundUser = await mongoDbUsersCollection.findOne({
            // вот тут я ошибку допустил, и забыл
            // что у меня в монгодб поле называется userName,
            // а не login, как в коде
            $or: [
                { userName: loginOrEmail },
                { email: loginOrEmail },
            ],
        });
        return foundUser;
    },

    // тестовый метод получения сразу всей инфы о всех юзерах
    async getAllUsersTest() {
        const allUsersFromDb = await mongoDbUsersCollection
            .find({})
            .toArray();
        return allUsersFromDb;
    },

    async getUserById(userId: ObjectId) {
        const foundUser = await mongoDbUsersCollection.findOne({
            // вот это важно кстати что искать по айдшникам
            // монго можно только оборачивая айди в
            // ObjectId
            // а ругается он на айди, потому что поле
            // скрытое через синтаксис "_" (исправлено
            // сменой типа _id на ObjectId)
            // ещё раз: userId: ObjectId!
            _id: new ObjectId(userId),
        });
        return foundUser;
    },
};
