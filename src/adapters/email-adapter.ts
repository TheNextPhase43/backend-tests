import nodemailer from "nodemailer";
import { settings } from "../settings";

// здесь адаптер выступает аналогом repository
// в обычных запросах к бд. и несёт он
// ответственность исключительно за работу с
// nodemailer (получая всё остальное от
// других частей приложения)
export const emailAdapter = {
    async sendEmail(
        messageDestination: string,
        messageSubject: string,
        messageContent: string
    ) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "alleskaput43@gmail.com",
                pass: settings.GOOGLE_NODEMAILER_APP_PASSWORD,
            },
        });

        const emailSendResult = transporter.sendMail({
            // внимание, способ указать своё имя для отправителя
            // одновременно с почтой (фишка именно почты)
            from: "Sigma's Backend <alleskaput43@gmail.com>",
            to: messageDestination,
            subject: messageSubject,
            html: `<h1 style="color: red; background-color: whitesmoke; padding: 20px;">${messageContent}</h1>`,
        });

        return emailSendResult;
    },
};
