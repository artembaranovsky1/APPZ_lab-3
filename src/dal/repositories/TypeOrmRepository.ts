import { Repository } from "typeorm";
import { IRepository } from "./IRepository";

export class TypeOrmRepository<T extends Object> implements IRepository<T> {
    constructor(
        private readonly ormRepository: Repository<T>,
        private readonly primaryKeyName: keyof T
    ) {}

    public async getById(id: string | number): Promise<T | null> {
        return await this.ormRepository.findOneBy({ [this.primaryKeyName]: id } as any);
    }

    public async getAll(): Promise<T[]> {
        return await this.ormRepository.find();
    }

    public async add(entity: T): Promise<void> {
        if (this.primaryKeyName === 'id' && (entity as any).id === 0) {
            delete (entity as any).id;
        }

        const savedEntity = await this.ormRepository.save(entity);

        if (this.primaryKeyName === 'id') {
            (entity as any).id = (savedEntity as any).id;
        }
    }

    public async update(entity: T): Promise<void> {
        await this.ormRepository.save(entity);
    }

    public async delete(id: string | number): Promise<void> {
        await this.ormRepository.delete({ [this.primaryKeyName]: id } as any);
    }
}