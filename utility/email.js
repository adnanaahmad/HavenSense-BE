const nodemailer = require('nodemailer');

/**
 * Email Class
 * to be used in the following way: new Email(user, url).sendWelcome
 * where the use case is to send the welcome email when a new user signs up
 */
module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name;
        this.from = `Shadoe Hanson <${process.env.GMAIL_USERNAME}>`;
        this.url = url;
    }
    /**
     * createTransport function
     * we wanna have different transports based on production or development environment,
     * because unlike development mode ( where node mailer is used to send emails to mailtrap),
     * real emails are sent in production via send grid or gmail service.
     */
    createTransport() {
        if(process.env.NODE_ENV === 'production') {
            // gmail
            return nodemailer.createTransport({
                service: 'hotmail',
                auth: {
                    user: process.env.GMAIL_USERNAME,
                    pass: process.env.GMAIL_PASSWORD
                }
            });
        } else {
            // mailtrap
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
        }
    }
    // send email
    async send(template, subject) {
        // define email options
        const mailOptions = {
            from: this.from,
            to: `${this.firstName} <${this.to}>`,
            subject: subject,
            html: template,
            text: 'hello',
        };
        // create transport and send email
        await this.createTransport().sendMail(mailOptions);
    }
    // welcome email
    async sendWelcome() {
        await this.send(`<p>click on the following link to verify your account </p><a href="${this.url}">verify yourself</a>`, 'Welcome to Havensense');
    }
}