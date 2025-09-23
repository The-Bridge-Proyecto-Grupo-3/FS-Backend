const nodemailer = require('nodemailer');
const env = require('../config/env');

const transport = nodemailer.createTransport({
    port: env.smtp.port,
    host: env.smtp.host,
    secure: env.smtp.secure,
    tls: {
        rejectUnauthorized: true
    },
    logger: env.mail.logging
});

module.exports = {
    sendMail: ({ to, subject, text, html }) => {
        transport.sendMail({
            to, subject, text, html,
            from: env.mail.from
        });
    }
}