import { emailAdapter } from "../adapters/email-adapter";

// а вот это уже как раз бизнес-логика (ну или
// просто логика приложения) работы конкретно
// с почтой (emailAdapter в данном случае
// это аналог repository)
export const emailManager = {
    async sendPasswordRecoveryMessage(user: any) {
        await emailAdapter.sendEmail(
            "user.email",
            "pass recovery",
            "user.recoveryCode"
        );
    },
};
