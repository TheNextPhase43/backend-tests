import { emailManager } from "../managers/email-manager";

// этот сервис чисто для примера
// по идее для работы конкретно с почтой
// есть emailManager, а это должен быть некий
// элемент бизнес-логики, которому понадобилось
// обратится к логике работы с почтой
// можно представить, что это например recovery
// сервис, который через (например) authMiddleware
// проверяет подлинность (ну то есть проверяет ещё роутер)
// пользователя, получает его, и по нему делает
// какие-то действия с почтой и другими сервисами
// короче это всё архитектурные моменты, которые просто
// пока есть в теории, так как в этом проекте пока нет
// подобного функционала
export const emailService = {
    async sendPasswordRecoveryMessage(user: object) {
        // save to repo
        // get user from repo
        await emailManager.sendPasswordRecoveryMessage(user);
    },
};
