const bcrypt = require('bcrypt');
const ADMIN_HASH = '$2b$10$5LfXdX0h/p3XMNqqdefWXu8pM0bs6ghAkPuCvh2mCHog2o8KZJN9q';
const UserDB = require('../models/user.model');

const verifyLogin = async (email, password) => {
   const userWithMail = await UserDB.User.findOne({ email: email }).exec();
   return userWithMail !== null && userWithMail.isValid(password) ? userWithMail : undefined;
};

const userWithIDHasPassword = async (id, password) => {
   const user = await UserDB.User.findById({ _id: id }).exec();
   const valid = user.isValid(password);
   return valid;
};

module.exports = {
   verifyLogin: verifyLogin,
   userWithIDHasPassword,
};
