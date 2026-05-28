import { injectable, inject } from "tsyringe";
import { IAdService } from '../interfaces/IAdService';
import { IUnitOfWork } from '../../dal/uow/IUnitOfWork';
import { AdMapper } from '../mapping/AdMapper';
import { AdDTO } from '../dto/AdDTO';
import { CreateAdDTO } from '../dto/CreateAdDTO';
import { AdEntity } from '../../dal/entities/AdEntity';

@injectable()
export class AdService implements IAdService {
    constructor(@inject("IUnitOfWork") private readonly uow: IUnitOfWork) {}

    public async createAd(dto: CreateAdDTO): Promise<AdDTO> {
        let categoryName = dto.categoryName.trim() || "Різне";

        const catObj = await this.uow.categories.getById(categoryName);
        if (!catObj) await this.uow.categories.add({ name: categoryName });

        const validTags: string[] = [];
        for (const tagName of dto.tagNames) {
            const trimmedName = tagName.trim();
            if (!trimmedName) continue;

            const tagObj = await this.uow.tags.getById(trimmedName);
            if (!tagObj) await this.uow.tags.add({ name: trimmedName });

            validTags.push(trimmedName);
        }

        const entity = new AdEntity();
        entity.title = dto.title;
        entity.content = dto.content;
        entity.price = dto.price;
        entity.authorId = dto.authorId;
        entity.categoryName = categoryName;
        entity.tagNames = validTags;
        entity.isActive = true;

        await this.uow.ads.add(entity);
        await this.uow.saveChanges();

        const users = await this.uow.users.getAll();
        return AdMapper.toDTO(entity, users);
    }

    public async deactivateAd(adId: number, currentUserId: number): Promise<void> {
        const ad = await this.uow.ads.getById(adId);
        if (!ad) throw new Error("Оголошення не знайдено.");
        if (ad.authorId !== currentUserId) throw new Error("Відмова в доступі.");
        ad.isActive = false;
        await this.uow.ads.update(ad);
    }

    public async deleteAd(adId: number, currentUserId: number): Promise<void> {
        const ad = await this.uow.ads.getById(adId);
        if (!ad) throw new Error("Оголошення не знайдено.");
        if (ad.authorId !== currentUserId) throw new Error("Відмова в доступі.");
        await this.uow.ads.delete(adId);
    }

    public async getAllAds(): Promise<AdDTO[]> {
        const ads = await this.uow.ads.getAll();
        const users = await this.uow.users.getAll();
        return ads.map(ad => AdMapper.toDTO(ad, users));
    }

    public async getCategories(): Promise<{ name: string }[]> {
        return await this.uow.categories.getAll();
    }

    public async searchAdsByCategoryName(categoryName: string): Promise<AdDTO[]> {
        const ads = await this.uow.ads.getAll();
        const users = await this.uow.users.getAll();
        const filteredAds = ads.filter(ad => ad.categoryName.toLowerCase() === categoryName.trim().toLowerCase());
        return filteredAds.map(ad => AdMapper.toDTO(ad, users));
    }

    public async searchAdsByTagName(tagName: string): Promise<AdDTO[]> {
        const ads = await this.uow.ads.getAll();
        const users = await this.uow.users.getAll();
        const targetTag = tagName.trim().toLowerCase();

        const filteredAds = ads.filter(ad =>
            ad.tagNames && ad.tagNames.some(t => t.toLowerCase() === targetTag)
        );
        return filteredAds.map(ad => AdMapper.toDTO(ad, users));
    }


    public async searchAds(query: string): Promise<AdDTO[]> {
        const ads = await this.uow.ads.getAll();
        const users = await this.uow.users.getAll();
        const lowerQuery = query.toLowerCase().trim();

        const filteredAds = ads.filter(ad => {
            const matchTitle = ad.title.toLowerCase().includes(lowerQuery);

            const matchTags = ad.tagNames && ad.tagNames.some(t => t.toLowerCase().includes(lowerQuery));

            return matchTitle || matchTags;
        });

        return filteredAds.map(ad => AdMapper.toDTO(ad, users));
    }
}