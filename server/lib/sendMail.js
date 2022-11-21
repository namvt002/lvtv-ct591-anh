require("dotenv").config();
const nodemailer = require("nodemailer");
exports.sendEmail = (options) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        tls: {
            rejectUnauthorized: false,
        },
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.EMAIL_PWD, // generated ethereal password
        },
    });
    return transporter.sendMail(options);
};
