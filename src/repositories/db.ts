import { MongoClient } from "mongodb";
import { Collection } from "./../../node_modules/mongodb/src/collection";

export type Title = {
    id: number;
    title: string;
    length: number;
};

const mongoUri =
    process.env.PORT ||
    "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.4.2";

const client = new MongoClient(mongoUri);
const db = client.db("TitlesDataBase");
export const mongoDbTitlesCollection = db.collection<Title>("titles");

export async function runDb() {
    try {
        await client.connect();
    } catch {
        await client.close();
    }
}
