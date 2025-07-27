export const settings = {
    port: process.env.port || 3003,
    MONGO_URI:
        process.env.mongoURI ||
        "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.4.2",
    JWT_SECRET: process.env.JWT_SECRET || "123",
    GOOGLE_NODEMAILER_APP_PASSWORD:
        process.env.GOOGLE_NODEMAILER_APP_PASSWORD ||
        "hmxqofxlqfevybvm",
};
