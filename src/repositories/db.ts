import { MongoClient, ObjectId } from "mongodb";
import { settings } from "../settings";

export type Title = {
    id: number;
    title: string;
    length: number;
};

export type UserDBType = {
    _id: ObjectId;
    userName: string;
    email: string;
    passwordHash: string;
    // по идее хранить соль в бд не надо
    // но пока тестим
    passwordSalt: string;
    createdAt: object;
};

export type UserAccountInDBType = {
    _id: ObjectId;
    accountData: {
        userName: string;
        email: string;
        passwordHash: string;
        createdAt: object;
    };
    emailConfirmation: {
        confirmation: string;
        expirationDate: object;
        isConfirmed: boolean;
    };
};

export type FeedbackDBType = {
    feedbackText: string;
    // внимание, это именно айдишник
    // ПОЛЬЗОВАТЕЛЯ, который оставил
    // фидбек
    userId: ObjectId;
    _id: ObjectId;
};

// работа с монгодб
const client = new MongoClient(settings.MONGO_URI);

// бд titles
const titlesDb = client.db("TitlesDataBase");
// коллекция titles в дб titles
export const mongoDbTitlesCollection =
    titlesDb.collection<Title>("titles");

// бд users
const usersDb = client.db("UsersDataBase");
export const mongoDbUsersCollection =
    usersDb.collection<UserAccountInDBType>("usersCollection");

// бд feedBack
const feedBackDb = client.db("FeedbackDataBase");
export const mongoDbFeedbackCollection =
    feedBackDb.collection<FeedbackDBType>("feedbackCollection");

export async function runDb() {
    try {
        await client.connect();
    } catch {
        await client.close();
    }
}
