import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Ads")
export class AdEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    title!: string;

    @Column("text")
    content!: string;

    @Column("real")
    price!: number;

    @Column("int")
    authorId!: number;

    @Column("text")
    categoryName!: string;

    @Column("simple-array")
    tagNames!: string[];

    @Column("boolean")
    isActive!: boolean;
}