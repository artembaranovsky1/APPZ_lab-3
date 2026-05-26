import { Entity, PrimaryColumn } from "typeorm";

@Entity("Categories")
export class CategoryEntity {
    @PrimaryColumn("text")
    name!: string;
}