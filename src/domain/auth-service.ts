import { userRepository } from "../repositories/users-repository";
import { UserAccountInDBType, UserDBType } from '../repositories/db';
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns/add";
import { emailManager } from "../managers/email-manager";

type checkIsDataAlreadyInUseType = {
    isEmailAlreadyInUse: boolean;
    isLoginAlreadyInUse: boolean;
};

export const authService = {
    // первая версия эндпоинта создания юзера
    // (рабочая, но по ходу развития добавляются
    // новые функции и эндпоинт должен начать работать
    // по другому)
    // async createUser(
    //     login: string,
    //     email: string,
    //     password: string
    // ): Promise<UserDBType | checkIsDataAlreadyInUseType> {
    //     // хз уместно ли делать проверку именно тут
    //     // пока не знаю
    //     const isInsertedDataAlreadyInUse: checkIsDataAlreadyInUseType =
    //         await this.checkIsDataAlreadyInUse(login, email);

    //     // если логин или емейл уже есть у
    //     // кого-то в базе, то на роутер
    //     // вернётся объект ошибки: AlreadyUsedDataErrorType
    //     if (
    //         isInsertedDataAlreadyInUse.isLoginAlreadyInUse === true ||
    //         isInsertedDataAlreadyInUse.isEmailAlreadyInUse === true
    //     ) {
    //         return isInsertedDataAlreadyInUse;
    //     }

    //     const passwordSalt = await bcrypt.genSalt(10);
    //     const passwordHash = await this._generateHash(
    //         password,
    //         passwordSalt
    //     );

    //     const newUser: UserDBType = {
    //         _id: new ObjectId(),
    //         userName: login,
    //         email,
    //         passwordHash,
    //         passwordSalt,
    //         createdAt: new Date(),
    //     };
    //     return userRepository.createUser(newUser);
    // },

    async createUser(
        login: string,
        email: string,
        password: string
    ): Promise<UserAccountInDBType | null> {
        // функция пока старого типа, переделать
        const passwordHash = await this._generateHash(password);

        const user: UserAccountInDBType = {
            _id: new ObjectId(),
            accountData: {
                userName: login,
                email,
                passwordHash,
                createdAt: new Date(),
            },
            emailConfirmation: {
                // код подтверждения емейла
                confirmation: uuidv4(),
                // время, когда код перестанет
                // действовать
                // текущая дата + сколько-то
                // ещё, сколько укажем
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3,
                }),
                isConfirmed: false,
            },
        };

        // тут я забыл await добавить и всё по жопе пошло в один момент
        const creationResult: UserAccountInDBType = await userRepository.createUser(user);

        try {
            await emailManager.sendPasswordRecoveryMessage(
                creationResult
            );
        } catch (error) {
            console.log(error);
            // сделать
            // await userRepository.deleteUser(user._id);
            return null;
        }

        return creationResult;
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
    ): Promise<UserAccountInDBType | null> {
        // ищем такого юзера
        const foundUser = await userRepository.findUserByLoginOrEmail(
            loginOrEmail
        );

        // если нет то null
        if (!foundUser) return null;

        // если есть то генерируем хеш из переданного
        // пароля и соли юзера
        const isPasswordCorrect: boolean = await bcrypt.compare(
            password,
            foundUser.accountData.passwordHash
        );

        // не верный пароль - возврат null
        // есть идея ещё сюда впихать возврат объекта
        // ошибки, с описанием того, что пароль не подходит
        if (!isPasswordCorrect) return null;

        // в случае успешной аутентификации
        // возвращаем юзера из ДБ
        return foundUser;
    },

    // в метод _generateHash передаётся
    // обычный пароль (не хеш)
    async _generateHash(passwordToEncrypt: string) {
        const hash = await bcrypt.hash(passwordToEncrypt, 10);
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
