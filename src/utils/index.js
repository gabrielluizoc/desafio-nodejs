const nodemailer = require('nodemailer');
const config = require('./../config');
const bcrypt = require('bcryptjs');
const Cryptr = require('cryptr');
require('dotenv').config();
const cryptr = new Cryptr(process.env.SECRET_DATA);
const methods = {};


methods.encrypt = (param) => {
    return cryptr.encrypt(param);
}

methods.decrypt = (param) => {
    return cryptr.decrypt(param);
}

methods.generateHash = async(param, strength) => {
    return await bcrypt.hash(param, strength);
}

const transporter = nodemailer.createTransport(config.configSendmail);

methods.sendMail = (email, subject, message, html) => {
    const mailOptions = {
        from: '"Email Name" no-reply@email.com.br',
        to: `${email}`,
        subject: `${subject}`,
        text: `${message}`,
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        } else {
            return console.log(`Email successfully sent to ${email}!`);
        }
    });
};

methods.createQuery = (arrayList, isActive) => {
    let arrayQuery = [];
    for(let i = 0; i < arrayList.length; i++){
        arrayQuery.push(`(${Object.values(arrayList[i])},${isActive})`);
    }
    return arrayQuery.join(', ');
}

module.exports = methods;
