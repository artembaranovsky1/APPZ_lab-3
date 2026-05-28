import "reflect-metadata";
import express from "express";
import { container } from "tsyringe";
import { UnitOfWork } from "./dal/uow/UnitOfWork";
import { AdService } from "./bll/services/AdService";
import { setupApiRoutes } from "./pl/routes/api";

async function bootstrap() {
    console.log("Ініціалізація бази даних...");

    const uow = new UnitOfWork();
    await uow.initialize();

    container.registerInstance("IUnitOfWork", uow);
    container.register("IAdService", { useClass: AdService });

    const app = express();
    app.use(express.json());
    app.use(express.static('public'));


    app.use("/api", setupApiRoutes());

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(` Відкрийте у браузері: http://localhost:${PORT}`);
    });
}

bootstrap().catch(err => {
    console.error("Помилка ініціалізації сервера:", err);
    process.exit(1);
});