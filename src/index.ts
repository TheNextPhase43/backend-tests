import { app } from "./app";
import { runDb } from "./repositories/db";
import { settings } from "./settings";

async function startApp() {
    await runDb();
    app.listen(settings.port, () => {
        console.log("Server started!!!");
    });
}

startApp();
