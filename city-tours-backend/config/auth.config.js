require('dotenv').config();

module.exports = {
   mail_secret: process.env.SECRET_MAIL_KEY,
   reset_password_secret: process.env.RESET_PASSWORD_KEY,
   user: process.env.CONFIRMATION_MAIL,
   pass: process.env.MAIL_PASSWORD,
};
