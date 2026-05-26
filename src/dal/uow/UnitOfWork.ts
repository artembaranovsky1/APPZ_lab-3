import "reflect-metadata";
import { DataSource } from "typeorm";
import { IUnitOfWork } from "./IUnitOfWork";
import { TypeOrmRepository } from "../repositories/TypeOrmRepository";
import { AdEntity } from "../entities/AdEntity";
import { UserEntity } from "../entities/UserEntity";
import { CategoryEntity } from "../entities/CategoryEntity";
import { TagEntity } from "../entities/TagEntity";

export class UnitOfWork implements IUnitOfWork {
    private dataSource: DataSource;

    public ads!: TypeOrmRepository<AdEntity>;
    public users!: TypeOrmRepository<UserEntity>;
    public categories!: TypeOrmRepository<CategoryEntity>;
    public tags!: TypeOrmRepository<TagEntity>;

    constructor() {
        this.dataSource = new DataSource({
            type: "sqlite",
            database: "database.sqlite",
            entities: [AdEntity, UserEntity, CategoryEntity, TagEntity],
            synchronize: true,
            logging: false
        });
    }

    public async initialize(): Promise<void> {
        await this.dataSource.initialize();


        this.ads = new TypeOrmRepository(this.dataSource.getRepository(AdEntity), "id");
        this.users = new TypeOrmRepository(this.dataSource.getRepository(UserEntity), "id");
        this.categories = new TypeOrmRepository(this.dataSource.getRepository(CategoryEntity), "name");
        this.tags = new TypeOrmRepository(this.dataSource.getRepository(TagEntity), "name");
    }

    public async saveChanges(): Promise<void> {
    }
}