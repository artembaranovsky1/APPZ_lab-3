export interface IRepository<T> {
    getById(id: string | number): Promise<T | null>; // Тепер приймає і текст, і числа
    getAll(): Promise<T[]>;
    add(entity: T): Promise<void>;
    update(entity: T): Promise<void>;
    delete(id: string | number): Promise<void>;
}