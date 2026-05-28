export class CreateAdRequest {
    title!: string;
    content!: string;
    price!: number;
    authorId!: number;
    categoryName!: string;
    tagNames!: string[];
}