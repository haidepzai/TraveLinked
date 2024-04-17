const nodemailer = require('nodemailer');
const config = require('./auth.config');
require('dotenv').config();

const user = config.user;
const pass = config.pass;

const transport = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
      user: user,
      pass: pass,
   },
});

const sendConfirmationEmail = (name, email, confirmationCode) => {
   console.log('Confirmation Email');
   transport
      .sendMail({
         from: user,
         to: email,
         subject: 'Please confirm your account',
         html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for registration. Please confirm your email by clicking on the following link</p>
          <a href=${process.env.BASE_URL}/confirm/${confirmationCode}> Click here</a>
          </div>`,
      })
      .catch((err) => console.error(err));
};

const sendPasswordRecovery = (name, email, confirmationCode) => {
   console.log('Password Recovery');
   transport
      .sendMail({
         from: user,
         to: email,
         subject: 'Password Recovery',
         html: `<h1>Password Recovery</h1>
          <h2>Hello ${name}</h2>
          <p>Seems like you forgot your password for TraveLinked. If this is true, click the link below to reset your password.</p>
          <a href=${process.env.BASE_URL}/resetpassword/${confirmationCode}> Click here</a>
          <p>If you did not forgot your password you can safely ignore this email.</p>
          </div>`,
      })
      .catch((err) => console.error(err));
};

const sendContactForm = (name, email, message) => {
   console.log('Contact Form');
   transport
      .sendMail({
         from: user,
         to: user,
         subject: 'New Request',
         html: `<h1>Sender's Mail: ${email}</h1>
          <h2>From: ${name}</h2>
          <h3>Message:</h3>
          <p>${message}</p>
          </div>`,
      })
      .catch((err) => console.error(err));
};

module.exports = {
   sendConfirmationEmail,
   sendPasswordRecovery,
   sendContactForm,
};
