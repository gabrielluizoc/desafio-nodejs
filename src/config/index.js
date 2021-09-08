require('dotenv').config();

exports.configSendmail = {
    host: process.env.SENDMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDMAIL_EMAIL,
        pass: process.env.SENDMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
}
