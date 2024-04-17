const nodemailer = require('./../config/nodemailer.config');

const sendContactMessage = async (req, res) => {
   try {
      nodemailer.sendContactForm(req.body.name, req.body.email, req.body.message);
      res.status(200).send({ successMessage: 'Message successfully sent' });
   } catch (err) {
      res.status(500).send({ errorMessage: err });
   }
};

module.exports = {
   sendContactMessage,
};
