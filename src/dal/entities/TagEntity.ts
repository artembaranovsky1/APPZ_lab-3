import { Entity, PrimaryColumn } from "typeorm";

@Entity("Tags")
export class TagEntity {
    @PrimaryColumn("text")
    name!: string;
}