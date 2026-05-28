import { Entity, PrimaryColumn } from "typeorm";

@Entity("Categories")
export class CategoryEntity {
    @PrimaryColumn("varchar", { length: 100 })
    name!: string;
}