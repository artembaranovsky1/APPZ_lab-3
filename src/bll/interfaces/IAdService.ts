import { AdDTO } from '../dto/AdDTO';
import { CreateAdDTO } from '../dto/CreateAdDTO';

export interface IAdService {
    createAd(dto: CreateAdDTO): Promise<AdDTO>;
    deactivateAd(adId: number, currentUserId: number): Promise<void>;
    deleteAd(adId: number, currentUserId: number): Promise<void>;
    getAllAds(): Promise<AdDTO[]>;
    getCategories(): Promise<{ name: string }[]>;

    searchAdsByCategoryName(categoryName: string): Promise<AdDTO[]>;
    searchAdsByTagName(tagName: string): Promise<AdDTO[]>;
}