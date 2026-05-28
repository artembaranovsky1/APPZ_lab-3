import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { IUnitOfWork } from "../../dal/uow/IUnitOfWork";

@injectable()
export class AuthApiController {
    constructor(@inject("IUnitOfWork") private readonly uow: IUnitOfWork) {}

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { username } = req.body;
            if (!username) {
                res.status(400).json({ error: "Ім'я користувача обов'язкове" });
                return;
            }

            const users = await this.uow.users.getAll();
            let user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

            if (!user) {
                await this.uow.users.add({ id: 0, username: username });
                const updatedUsers = await this.uow.users.getAll();
                user = updatedUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
            }

            res.json(user);
        } catch (error: any) {
            res.status(500).json({ error: "Помилка під час авторизації: " + error.message });
        }
    };
}