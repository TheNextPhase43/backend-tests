import { emailAdapter } from "../adapters/email-adapter";
import { UserAccountInDBType } from "../repositories/db";

// а вот это уже как раз бизнес-логика (ну или
// просто логика приложения) работы конкретно
// с почтой (emailAdapter в данном случае
// это аналог repository)
export const emailManager = {
    async sendPasswordRecoveryMessage(user: UserAccountInDBType) {
        await emailAdapter.sendEmail(
            user.accountData.email,
            "pass recovery",
            user.emailConfirmation.confirmation
        );
    },
};
