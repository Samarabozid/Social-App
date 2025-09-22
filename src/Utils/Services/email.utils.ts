import nodemailer from 'nodemailer';
import { EventEmitter } from "node:events";
import { IEmail } from "../../Common/Interfaces/user.interface.js";

export const sendEmail = async ({
    to, cc, subject, content, attachments = []
}: IEmail) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to,
        cc,
        subject,
        html: content,
        attachments
    });
    console.log("Email sent successfully", info);

    return info;
}

export const localEmitter = new EventEmitter();
localEmitter.on("sendEmail", (args:IEmail) => {
    console.log("Sending email event has started");
    sendEmail(args);
})

