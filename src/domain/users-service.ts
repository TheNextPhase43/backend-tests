import { userRepository } from "../repositories/users-repository";
import { UserAccountInDBType, UserDBType } from "../repositories/db";
import { ObjectId } from "mongodb";

export const usersService = {
    // тестовый метод получения сразу всей инфы о всех юзерах
    async getAllUsersTest() {
        const allUsersFromDb = await userRepository.getAllUsersTest();
        return allUsersFromDb;
    },

    // пока что этот метод есть и в auth-service
    // пока не решил где оставить (пофиг)
    async findUserById(userId: ObjectId) {
        const foundUser = await userRepository.getUserById(userId);
        return foundUser;
    },
};
