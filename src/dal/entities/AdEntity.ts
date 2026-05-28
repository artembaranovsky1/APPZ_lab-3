import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Ads")
export class AdEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("varchar", { length: 100 })
    title!: string;

    @Column("varchar", { length: 100 })
    content!: string;

    @Column("real")
    price!: number;

    @Column("int")
    authorId!: number;

    @Column("varchar", { length: 100 })
    categoryName!: string;

    @Column("simple-array")
    tagNames!: string[];

    @Column("boolean")
    isActive!: boolean;
}