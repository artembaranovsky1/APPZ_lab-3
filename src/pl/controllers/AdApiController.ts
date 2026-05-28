import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { IAdService } from "../../bll/interfaces/IAdService";
import { CreateAdRequest } from "../models/CreateAdRequest";
import { CreateAdDTO } from "../../bll/dto/CreateAdDTO";
import { AdViewModel } from "../models/AdViewModel";
import { AdDTO } from "../../bll/dto/AdDTO";

@injectable()
export class AdApiController {
    constructor(@inject("IAdService") private readonly adService: IAdService) {}

    public getAllAds = async (req: Request, res: Response): Promise<void> => {
        try {
            const searchQuery = req.query.search as string;
            let ads;

            if (searchQuery) {
                ads = await this.adService.searchAds(searchQuery);
            } else {
                ads = await this.adService.getAllAds();
            }

            const viewModels = ads.map(dto => this.mapToViewModel(dto));
            res.status(200).json(viewModels);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };


    public createAd = async (req: Request, res: Response): Promise<void> => {
        try {
            const requestModel: CreateAdRequest = req.body;

            const dto = new CreateAdDTO();
            dto.title = requestModel.title;
            dto.content = requestModel.content;
            dto.price = requestModel.price;
            dto.authorId = requestModel.authorId;
            dto.categoryName = requestModel.categoryName;
            dto.tagNames = requestModel.tagNames;

            const createdAd = await this.adService.createAd(dto);
            res.status(201).json(this.mapToViewModel(createdAd));
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    public deactivateAd = async (req: Request, res: Response): Promise<void> => {
        try {
            const adId = parseInt(req.params.id);
            const currentUserId = parseInt(req.body.currentUserId);

            await this.adService.deactivateAd(adId, currentUserId);
            res.status(200).json({ message: "Оголошення успішно деактивовано" });
        } catch (error: any) {
            res.status(403).json({ error: error.message });
        }
    };

    public deleteAd = async (req: Request, res: Response): Promise<void> => {
        try {
            const adId = parseInt(req.params.id);
            const currentUserId = parseInt(req.body.currentUserId);

            await this.adService.deleteAd(adId, currentUserId);
            res.status(200).json({ message: "Оголошення видалено" });
        } catch (error: any) {
            res.status(403).json({ error: error.message });
        }
    };

    private mapToViewModel(dto: AdDTO): AdViewModel {
        return {
            id: dto.id,
            title: dto.title,
            description: dto.content,
            priceFormatted: `${dto.price} грн`,
            author: dto.authorName,
            category: dto.categoryName,
            tags: dto.tagNames,
            status: dto.isActive ? "Активне" : "Неактивне"
        };
    }
}