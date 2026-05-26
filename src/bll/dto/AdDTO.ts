export class AdDTO {
    id!: number;
    title!: string;
    content!: string;
    price!: number;
    authorId!: number;
    authorName!: string;
    categoryName!: string;
    tagNames!: string[];
    isActive!: boolean;
}