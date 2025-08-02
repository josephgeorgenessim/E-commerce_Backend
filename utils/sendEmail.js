const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    //  create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false port 587
        auth: {
            user: process.env.EMAIL_USER_NAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // define email options
    const mailOptions ={
        from : 'E-commerce <3amkjoseph99@gmail.com>',
        to : options.email,
        subject : options.subject,
        text : options.message,
    }

    // send email 
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;