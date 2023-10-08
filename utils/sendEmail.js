
import nodemailer from 'nodemailer';

const sendEmail = async function(email,subject,message){

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        host: process.env.SMTP_PORT,
        secure : false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },

    });
    // mail send kiye with defind transport routes


    await transporter.sendMail({
        from:process.env.SMTP_FROM_EMAIL,
        to: email,
        subject : subject,
        html: message,
    });
};