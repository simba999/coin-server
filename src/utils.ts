import NodeMailer from 'nodemailer';

export function errorWrap(handler: any) {
    return function (...args: any[]) {
        handler(...args).catch(args[args.length - 1]);
    };
}

export function sendInvitationMail(to: string, message: string) {

    const mailConfig: object = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    };
    const transporter = NodeMailer.createTransport(mailConfig);

    // setup email data with unicode symbols
    const mailOptions = {
        from: '"Alex Vaitkus 👻" <alex.vaitkus@gmx.li>',
        to: to,
        subject: 'Hello ✔',
        text: message,
        html: '<div>' + message + '</div>'
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