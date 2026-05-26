import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Users")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    username!: string;
}