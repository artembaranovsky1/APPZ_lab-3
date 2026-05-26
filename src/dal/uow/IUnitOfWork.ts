import { IRepository } from '../repositories/IRepository';
import { AdEntity } from '../entities/AdEntity';
import { UserEntity } from '../entities/UserEntity';
import { CategoryEntity } from '../entities/CategoryEntity';
import { TagEntity } from '../entities/TagEntity';

export interface IUnitOfWork {
    readonly ads: IRepository<AdEntity>;
    readonly users: IRepository<UserEntity>;
    readonly categories: IRepository<CategoryEntity>;
    readonly tags: IRepository<TagEntity>;
    saveChanges(): Promise<void>;
}