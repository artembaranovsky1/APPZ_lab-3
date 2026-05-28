import { Router } from "express";
import { container } from "tsyringe";
import { AdApiController } from "../controllers/AdApiController";
import { AuthApiController } from "../controllers/AuthApiController";

export function setupApiRoutes(): Router {
    const router = Router();

    const adController = container.resolve(AdApiController);
    const authController = container.resolve(AuthApiController);

    router.post("/auth", authController.login);

    router.get("/ads", adController.getAllAds);
    router.post("/ads", adController.createAd);
    router.put("/ads/:id/deactivate", adController.deactivateAd);
    router.delete("/ads/:id", adController.deleteAd);

    return router;
}