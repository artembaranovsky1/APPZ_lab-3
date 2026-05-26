import "reflect-metadata";
import * as readline from 'readline';
import { UnitOfWork } from './dal/uow/UnitOfWork';
import { AdService } from './bll/services/AdService';
import { AdController } from './ui/controllers/AdController';
import { CreateAdDTO } from './bll/dto/CreateAdDTO';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query: string): Promise<string> => {
    return new Promise(resolve => rl.question(query, resolve));
};

async function bootstrap() {
    console.log("Ініціалізація системи...");

    const uow = new UnitOfWork();

    console.log("Підключення до бази даних SQLite...");
    await uow.initialize();

    const adService = new AdService(uow);
    const adController = new AdController(adService);

    const existingCategories = await uow.categories.getAll();
    if (existingCategories.length === 0) {
        console.log("База даних порожня. Додавання стартових категорій...");
    }

    async function getOrCreateUser(username: string) {
        const users = await uow.users.getAll();
        let user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (!user) {
            user = { id: 0, username: username };
            await uow.users.add(user);

            const updatedUsers = await uow.users.getAll();
            user = updatedUsers.find(u => u.username === username)!;
        }
        return user;
    }

    let isRunning = true;
    let currentUser: { id: number, username: string };

    console.log("\n=== Система управління дошкою оголошень ===");
    let usernameInput = await askQuestion("Введіть ваше ім'я користувача (для авторизації): ");
    currentUser = await getOrCreateUser(usernameInput.trim());

    while (isRunning) {
        console.log(`\nПоточний користувач: [${currentUser.username}] (ID: ${currentUser.id})`);
        console.log("Оберіть дію:");
        console.log("1. Переглянути всі оголошення");
        console.log("2. Створити нове оголошення");
        console.log("3. Деактивувати оголошення");
        console.log("4. Видалити оголошення");
        console.log("5. Змінити поточного користувача");
        console.log("6. Знайти оголошення за категорією");
        console.log("7. Знайти оголошення за тегом");
        console.log("0. Вийти");

        const choice = await askQuestion("Ваш вибір: ");

        switch (choice.trim()) {
            case '1':
                await adController.displayAll();
                break;

            case '2':
                const title = await askQuestion("Введіть заголовок: ");
                const content = await askQuestion("Введіть опис оголошення: ");
                const priceStr = await askQuestion("Введіть ціну: ");

                await adController.displayCategories();
                const categoryName = await askQuestion("Введіть категорію: ");

                const tagsStr = await askQuestion("Введіть теги: ");
                const tagNames = tagsStr.split(',').map(t => t.trim()).filter(t => t.length > 0);

                const newAd = new CreateAdDTO();
                newAd.title = title;
                newAd.content = content;
                newAd.price = parseFloat(priceStr) || 0;
                newAd.authorId = currentUser.id;
                newAd.categoryName = categoryName;
                newAd.tagNames = tagNames;

                await adController.create(newAd);
                break;

            case '3':
                const deactivateIdStr = await askQuestion("Введіть ID оголошення для деактивації: ");
                const deactivateId = parseInt(deactivateIdStr);
                if (!isNaN(deactivateId)) {
                    await adController.deactivate(deactivateId, currentUser.id);
                } else {
                    console.log("Помилка: Ви не можете деактивувати це оголошення!");
                }
                break;

            case '4':
                const deleteIdStr = await askQuestion("Введіть ID оголошення для видалення: ");
                const deleteId = parseInt(deleteIdStr);
                if (!isNaN(deleteId)) {
                    await adController.delete(deleteId, currentUser.id);
                } else {
                    console.log("Помилка: Ви не можете деактивувати це оголошення!");
                }
                break;

            case '5':
                usernameInput = await askQuestion("Введіть нове ім'я користувача: ");
                currentUser = await getOrCreateUser(usernameInput.trim());
                console.log(`Авторизацію змінено. Вітаємо, ${currentUser.username}!`);
                break;

            case '6':
                const searchCatName = await askQuestion("Введіть категорію для пошуку: ");
                await adController.searchByCategory(searchCatName);
                break;

            case '7':
                const searchTagName = await askQuestion("Введіть тег для пошуку: ");
                await adController.searchByTag(searchTagName);
                break;

            case '0':
                console.log("Збереження даних та завершення роботи програми...");
                isRunning = false;
                rl.close();
                break;

            default:
                console.log("Невідома команда. Будь ласка, оберіть цифру з меню");
                break;
        }
    }
}

bootstrap().catch(err => {
    console.error("Критична помилка виконання:", err);
    rl.close();
    process.exit(1);
});