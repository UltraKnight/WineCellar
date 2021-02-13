require('dotenv').config();

let nodemailer = require('nodemailer');

// Create the transporter with the required configuration for Outlook
let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// setup e-mail data, even with unicode symbols
let mailOptions = {
  from: 'WINE CELLAR <vanderlei.i.martins@outlook.com>', // sender address (who sends)
  to: 'vandi.martins94@gmail.com', // list of receivers (who receives)
  subject: 'Welcome to your Wine Cellar Manager', // Subject line
  text: 'We want to thank you for registering in Wine Cellar', // plaintext body
  //html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
};

module.exports = {mailModule: transporter, mailOptions};