import { app } from "./app";
import { runDb } from "./repositories/db";

const port = process.env.PORT || 3003;

async function startApp() {
    await runDb();
    app.listen(port, () => {
        console.log("Server started!!!");
    });
}


startApp();
