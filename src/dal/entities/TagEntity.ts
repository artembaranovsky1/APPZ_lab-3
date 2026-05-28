import { Entity, PrimaryColumn } from "typeorm";

@Entity("Tags")
export class TagEntity {
    @PrimaryColumn("varchar", { length: 100 })
    name!: string;
}