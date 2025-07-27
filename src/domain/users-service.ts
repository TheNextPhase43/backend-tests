import { userRepository } from "../repositories/users-repository";
import { UserDBType } from "../repositories/db";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

type checkIsDataAlreadyInUseType = {
    isEmailAlreadyInUse: boolean;
    isLoginAlreadyInUse: boolean;
};

// type AlreadyUsedDataErrorType = {
//     loginError: boolean;
//     emailError: boolean;
// };

// заменил класс на функцию (победа)
// function getAlreadyUsedDataErrorType(
//     isLoginAlreadyInUse: boolean,
//     isEmailAlreadyInUse: boolean
// ): AlreadyUsedDataErrorType {
//     return {
//         loginError: isLoginAlreadyInUse,
//         emailError: isEmailAlreadyInUse,
//     };
// }

export const userService = {
    async createUser(
        login: string,
        email: string,
        password: string
    ): Promise<UserDBType | checkIsDataAlreadyInUseType> {
        // хз уместно ли делать проверку именно тут
        // пока не знаю
        const isInsertedDataAlreadyInUse: checkIsDataAlreadyInUseType =
            await this.checkIsDataAlreadyInUse(login, email);

        // если логин или емейл уже есть у
        // кого-то в базе, то на роутер
        // вернётся объект ошибки: AlreadyUsedDataErrorType
        if (
            isInsertedDataAlreadyInUse.isLoginAlreadyInUse === true ||
            isInsertedDataAlreadyInUse.isEmailAlreadyInUse === true
        ) {
            return isInsertedDataAlreadyInUse;
            // я тут намудрил с функциями всякими обрабатывающими
            // ошибки (по моей идее это должно позволять
            // переиспользовать отправку ошибки, и удобно
            // организовывать данные)
            // return getAlreadyUsedDataErrorType(
            //     isInsertedDataAlreadyInUse.isLoginAlreadyInUse,
            //     isInsertedDataAlreadyInUse.isEmailAlreadyInUse
            // );
        }

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(
            password,
            passwordSalt
        );

        const newUser: UserDBType = {
            _id: new ObjectId(),
            userName: login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date(),
        };
        return userRepository.createUser(newUser);
    },

    // возможно следует разделить методы на проверку чисто
    // по емейлу и логину
    // true - такие данные уже используются
    async checkIsDataAlreadyInUse(login: string, email: string) {
        // ищем такого юзера
        const foundUserByLogin =
            await userRepository.findUserByLoginOrEmail(login);
        const foundUserByEmail =
            await userRepository.findUserByLoginOrEmail(email);

        return {
            isLoginAlreadyInUse:
                foundUserByLogin !== null ? true : false,
            isEmailAlreadyInUse:
                foundUserByEmail !== null ? true : false,
        };
    },

    // метод проверки ПАРОЛЯ юзера
    async checkCredentials(
        loginOrEmail: string,
        password: string
    ): Promise<UserDBType | null> {
        // ищем такого юзера
        const foundUser = await userRepository.findUserByLoginOrEmail(
            loginOrEmail
        );

        // если нет то null
        if (!foundUser) return null;

        // если есть то генерируем хеш из переданного
        // пароля и соли юзера
        const passwordHash = await this._generateHash(
            password,
            foundUser.passwordSalt
        );

        // равны ли хешированный пароль юзера из дб
        // и получившийся хеш (если пароль неверный,
        // то хеши не равны)
        // есть идея ещё сюда впихать возврат объекта
        // ошибки, с описанием того, что пароль не подходит
        if (foundUser.passwordHash !== passwordHash) return null;

        // в случае успешной аутентификации
        // возвращаем юзера из ДБ
        return foundUser;
    },

    // в метод _generateHash передаётся
    // обычный пароль (не хеш), и соль (хеш)
    async _generateHash(
        passwordToEncrypt: string,
        passwordSalt: string
    ) {
        const hash = await bcrypt.hash(
            passwordToEncrypt,
            passwordSalt
        );
        return hash;
    },

    // тестовый метод получения сразу всей инфы о всех юзерах
    async getAllUsersTest() {
        const allUsersFromDb = await userRepository.getAllUsersTest();
        return allUsersFromDb;
    },

    async findUserById(userId: ObjectId) {
        const foundUser = await userRepository.getUserById(userId);
        return foundUser;
    },
};
