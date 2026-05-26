import { AdEntity } from '../../dal/entities/AdEntity';
import { AdDTO } from '../dto/AdDTO';
import { UserEntity } from '../../dal/entities/UserEntity';

export class AdMapper {
    public static toDTO(entity: AdEntity, users: UserEntity[]): AdDTO {
        const author = users.find(u => u.id === entity.authorId);
        const authorName = author ? author.username : "Невідомий";

        return {
            id: entity.id,
            title: entity.title,
            content: entity.content,
            price: entity.price,
            authorId: entity.authorId,
            authorName: authorName,
            categoryName: entity.categoryName,
            tagNames: entity.tagNames || [],
            isActive: entity.isActive
        };
    }
}