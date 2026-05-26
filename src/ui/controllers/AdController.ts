import {IAdService} from '../../bll/interfaces/IAdService';
import {CreateAdDTO} from '../../bll/dto/CreateAdDTO';

export class AdController {
    constructor(private readonly adService: IAdService) {
    }

    public async create(dto: CreateAdDTO): Promise<void> {
        try {
            const ad = await this.adService.createAd(dto);
            console.log(`Успішно створено оголошення: "${ad.title}" (ID: ${ad.id}).`);
        } catch (error: any) {
            console.log(`Помилка створення: ${error.message}`);
        }
    }

    public async deactivate(adId: number, currentUserId: number): Promise<void> {
        try {
            await this.adService.deactivateAd(adId, currentUserId);
            console.log("Операція успішна. Оголошення деактивовано.");
        } catch (error: any) {
            console.log(`Помилка виконання: ${error.message}`);
        }
    }

    public async delete(adId: number, currentUserId: number): Promise<void> {
        try {
            await this.adService.deleteAd(adId, currentUserId);
            console.log("Операція успішна. Оголошення видалено.");
        } catch (error: any) {
            console.log(`Помилка виконання: ${error.message}`);
        }
    }

    public async displayAll(): Promise<void> {
        console.log("\n --- Всі оголошення ---");
        const ads = await this.adService.getAllAds();
        this.printAds(ads);
    }

    public async displayCategories(): Promise<void> {
        const categories = await this.adService.getCategories();
        console.log("\nДоступні категорії:");
        categories.forEach(c => console.log(`  - ${c.name}`));
    }

    public async searchByCategory(categoryName: string): Promise<void> {
        console.log(`\nОголошення в категорії: (${categoryName})`);
        const ads = await this.adService.searchAdsByCategoryName(categoryName);
        this.printAds(ads);
    }

    public async searchByTag(tagName: string): Promise<void> {
        console.log(`\nОголошення з такимим тегами: (${tagName})`);
        const ads = await this.adService.searchAdsByTagName(tagName);
        this.printAds(ads);
    }

    private printAds(ads: any[]): void {
        if (ads.length === 0) {
            console.log("Оголошень не знайдено.");
        } else {
            ads.forEach(ad => {
                const tagsStr = ad.tagNames && ad.tagNames.length > 0 ? ad.tagNames.join(', ') : 'Немає';
                const status = ad.isActive ? 'Активне' : 'Неактивне';
                console.log(`ID: ${ad.id} | Заголовок: "${ad.title}" | Ціна: ${ad.price} грн | Категорія: ${ad.categoryName} | Теги: [${tagsStr}] | Опис: ${ad.content} | Власник оголошення: ${ad.authorName} | Статус: ${status}`);
            });
        }
        console.log("---------------------------\n");
    }
}