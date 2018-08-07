import NodeMailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({path: '.env'});

export function errorWrap(handler: any) {
    return function (...args: any[]) {
        handler(...args).catch(args[args.length - 1]);
    };
}

export function sendInvitationMail(to: string) {

    const mailConfig: object = {
        host: process.env.SMTP,
        port: process.env.SMTP_PORT,
        secure: process.env.SECURE,
        auth: {
            user: process.env.USERNAME,
            pass: process.env.PASSWORD
        }
    };
    const transporter = NodeMailer.createTransport(mailConfig);

    // setup email data with unicode symbols
    const mailOptions = {
        from: '"Alex Vaitkus 👻" <alex.vaitkus@ishu.io>', // sender address
        to: to, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', NodeMailer.getTestMessageUrl(info));
    });
}