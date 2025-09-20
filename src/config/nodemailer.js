import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transport = nodemailer.createTransport({
    port: env.smtp.port,
    host: env.smtp.host,
    secure: env.smtp.secure,
    tls: {
        rejectUnauthorized: true
    },
    logger: env.mail.logging
});

export const sendMail = ({ to, subject, text, html }) => {
    transport.sendMail({
        ...mailData,
        from: env.mail.from
    });
};