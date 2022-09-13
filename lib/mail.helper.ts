import nodemailer from 'nodemailer';
import ejs from 'ejs'
import path from 'path';

interface SendMailOptions {
    email: string;
    template: string;
    data?: any;
    options?: {
        subject?: string;
        from?: string
    }
}

/**
 * THIS UTILITY CLASS HANDLES EVERYTHING ASSOCIATED WITH SENDING AN EMAIL
 */

export default class MailUtility {

    // create reusable transporter object using the default SMTP transport
    static transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 2525,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });



    static async sendEmail({
        email,
        template,
        data,
        options
    }: SendMailOptions) {

        // send mail with defined transport object
        /**
         * RENDER THE FILE INTO HTML STRING
         */
        const renderedTemplate: string = await ejs.renderFile(path.join(__dirname, template), data);

        const info = await this.transporter.sendMail({
            from: `"${options?.from || "Admin"}" <support@scheduleapp.com>`, // sender address
            to: email, // list of receivers
            subject: options?.subject, // Subject line
            // text: "Hello world?", // plain text body
            html: renderedTemplate, // html body
        });
        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

}
