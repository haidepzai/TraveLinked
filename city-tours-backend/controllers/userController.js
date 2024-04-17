const userService = require('../services/userService');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('./../config/auth.config');
const nodemailer = require('./../config/nodemailer.config');
const tourService = require('../controllers/tourController');
const UserDB = require('../models/user.model');
const ChatDB = require('../models/chat.model');
const TourDB = require('../models/tour.model');
const tokenService = require('./../services/tokenService');
const imageStorageService = require('./../services/imageStorageService');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const submitLogin = async (req, res) => {
   const authorizationHeader = req.body.userCredentials;
   if (!authorizationHeader) {
      return res.status(401).send({ errorMessage: 'Missing user credentials' });
   }
   const decodedString = Buffer.from(authorizationHeader, 'base64').toString('binary');
   const loginList = decodedString.split(':');
   const user = await userService.verifyLogin(loginList[0], loginList[1]); //email, password
   if (!user) {
      return res.status(401).send({ errorMessage: 'Wrong username or password, please try again' });
   }
   //If user status is not active (email has not been confirmed yet)
   if (user.status !== 'Active') {
      return res.status(401).send({
         errorMessage: 'Pending Account. Please Verify Your Email!',
      });
   }
   const authTokens = tokenService.createAuthenticationTokens(loginList[0], user._id, user.fullName, user.role);
   if (authTokens) return res.status(200).send(authTokens);
   return res.status(500).send({ errorMessage: 'refresh token konnte nicht gespeichert werden' });
};

//register
const register = (req, res, next) => {
   addToDB(req, res);
};

async function addToDB(req, res) {
   const token = jwt.sign({ email: req.body.email }, config.mail_secret); //Token for confirmation email

   var user = new UserDB.User({
      fullName: req.body.fullName,
      email: req.body.email,
      hashedPassword: UserDB.User.hashPassword(req.body.password),
      confirmationCode: token,
      resetPasswordCode: uuidv4(),
   });

   user.save((err) => {
      console.error(err);
      if (!err) {
         res.send({
            successMessage: 'You have successfully registered! Please check your email',
         });
         nodemailer.sendConfirmationEmail(user.fullName, user.email, user.confirmationCode);
      } else if (err.code === 11000) {
         res.status(422).send({ errorMessage: 'Duplicate email address found.' });
      } else {
         return res.status(500).send({ errorMessage: err });
      }
   });
}

const forgotPassword = async (req, res) => {
   const user = await UserDB.User.findOne({ email: req.body.email });

   if (!user) {
      res.status(404).send({ errorMessage: 'User not found' });
   }

   const token = jwt.sign({ email: req.body.email }, config.reset_password_secret);

   user.resetPasswordCode = token;

   user.save((err) => {
      if (!err) {
         res.send({
            successMessage: 'Please check your mail to reset your password!',
         });
         nodemailer.sendPasswordRecovery(user.fullName, user.email, user.resetPasswordCode);
      } else {
         return res.status(500).send({ errorMessage: err });
      }
   });
};

const resetPassword = (req, res) => {
   const { resetPasswordCode, newPassword } = req.body;

   if (resetPasswordCode) {
      jwt.verify(resetPasswordCode, process.env.RESET_PASSWORD_KEY, (err, decodedData) => {
         if (err) {
            return res.status(401).send({ errorMessage: 'Incorrect token or expired token' });
         }

         UserDB.User.findOne({
            resetPasswordCode: req.body.resetPasswordCode,
         })
            .then((user) => {
               if (!user) {
                  return res.status(404).send({ errorMessage: 'Link has expired!' });
               }

               user.hashedPassword = UserDB.User.hashPassword(newPassword);
               user.resetPasswordCode = null;

               user.save((err, doc) => {
                  if (!err) {
                     return res.status(200).send(user);
                  }
                  return res.status(500).send({ errorMessage: err });
               });
            })
            .catch((e) => console.log('error', e));
      });
   }
};

const verifyUser = (req, res, next) => {
   jwt.verify(req.params.confirmationCode, process.env.SECRET_MAIL_KEY, (err, decodedData) => {
      if (err) {
         return res.status(401).send({ errorMessage: 'Incorrect token or expired token' });
      }

      UserDB.User.findOne({
         confirmationCode: req.params.confirmationCode,
      })
         .then((user) => {
            if (!user) {
               return res.status(404).send({ errorMessage: 'User Not found.' });
            }
            if (user.status === 'Active') {
               return res.status(400).send({ errorMessage: 'Already activated' });
            }
            user.status = 'Active';

            user.save((err, doc) => {
               if (!err) {
                  const authTokens = tokenService.createAuthenticationTokens(
                     doc.email,
                     doc._id,
                     doc.fullName,
                     doc.role
                  );
                  if (authTokens) {
                     return res.status(200).send(authTokens); //TODO: id des users darf nicht angzeigt werden
                  }
                  return res.status(500).send({
                     errorMessage: 'Refresh token konnte nicht gespeichert werden',
                  });
               }
            });
         })
         .catch((e) => console.log('error', e));
   });
};

const getUsersByCharacter = async (req, res) => {
   const userList = await UserDB.User.find({
      fullName: { $regex: req.params.username, $options: 'i' },
   })
      .limit(5)
      .exec();
   res.status(200).send(userList);
};

const getVerifiedUserData = async (req, res) => {
   try {
      const user = await UserDB.User.findOne({ _id: req.userID }).exec();
      return res.status(200).send(user);
   } catch (error) {
      return res.status(500).send({ errorMessage: error });
   }
};

const updateUserProfile = async (req, res) => {
   const user = await UserDB.User.findById({ _id: req.userID });
   user.fullName = req.body.fullName ?? user.fullName;
   user.hometown = req.body.hometown ?? user.hometown;
   user.aboutMe = req.body.aboutMe ?? user.aboutMe;
   if (req.body.location !== undefined) {
      user.location = { type: 'Point', coordinates: [req.body.location[0], req.body.location[1]] };
   }
   user.profileIsPublic = req.body.profileIsPublic ?? user.profileIsPublic;
   user.isLocalGuide = req.body.isLocalGuide ?? user.isLocalGuide;

   user.save(async (err, doc) => {
      if (!err) {
         return res.status(200).send(doc);
      } else {
         return res.status(500).send({ errorMessage: err });
      }
   });
};

const updateUserPassword = async (req, res) => {
   let passwordHash;
   try {
      if (!(await userService.userWithIDHasPassword(req.userID, req.body.oldPassword))) {
         return res.status(401).send({ errorMessage: 'Old Password was wrong' });
      }
      passwordHash = UserDB.User.hashPassword(req.body.newPassword);
   } catch (error) {
      return res.status(500).send({ errorMessage: error });
   }
   try {
      await UserDB.User.findOneAndUpdate({ _id: req.userID }, { hashedPassword: passwordHash }).exec();
      return res.status(200).send({ infoMessage: 'updated password' });
   } catch (error) {
      return res.status(500).send({ errorMessage: error });
   }
};

const deleteUser = async (req, res) => {
   if (!(await userService.userWithIDHasPassword(req.userID, req.body.password))) {
      return res.status(403).send({ errorMessage: 'Password is not correct' });
   }
   try {
      const user = await UserDB.User.findOneAndDelete({ _id: req.userID }).exec();

      if (!(await imageStorageService.deleteFile(user.profilePicture.imageURL))) {
         return res.status(500).send({ errorMessage: 'File to delete could not be deleted' });
      }

      //Delete Following
      UserDB.User.updateMany({ followers: req.userID }, { $pull: { followers: req.userID } }).exec();
      //Delete Liked Tours
      TourDB.Tour.updateMany({ likedUsers: req.userID }, { $pull: { likedUsers: req.userID } }).exec();

      TourDB.Tour.updateMany({}, { $pull: { comments: { userId: req.userID } } }, { multi: true }).exec();

      //Delete Chat
      ChatDB.Chat.deleteMany({ $or: [{ clientOne: req.userID }, { clientTwo: req.userID }] }).exec(
         async (err, docs) => {
            if (!err) {
               //Delete Tours
               tourService.clearToursOfUser(req.userID).then(
                  (deleteRes) => {
                     console.log(deleteRes);
                     if (deleteRes === true) {
                        return res.status(200).send({ infoMessage: 'Deleted all tours of the user' });
                     } else {
                        return res.status(500).send({ errorMessage: deleteRes });
                     }
                  },
                  (err) => {
                     console.log('error ', err);
                     return res.status(500).send({ errorMessage: err });
                  }
               );
            } else {
               return res.status(500).send({ errorMessage: 'No chats to delete found' });
            }
         }
      );
   } catch (error) {
      console.log('other errror', error);
      return res.status(500).send({ errorMessage: error });
   }
};

const getUserById = async (req, res) => {
   try {
      const user = await UserDB.User.findById({ _id: req.params.userid }).exec();
      res.status(200).send(user);
   } catch (err) {
      return res.status(500).send({ errorMessage: error });
   }
};

const followUser = async (req, res) => {
   try {
      UserDB.User.findOneAndUpdate({ _id: req.userID }, { $addToSet: { following: req.params.userid } }).exec(
         async (err, docs) => {
            if (!err) {
               try {
                  await UserDB.User.findOneAndUpdate(
                     { _id: req.params.userid },
                     { $addToSet: { followers: req.userID } }
                  ).exec();
                  return res.status(200).send({ successMessage: 'User successfully followed' });
               } catch (err) {
                  return res.status(500).send({ errorMessage: 'User not found' });
               }
            }
         }
      );
   } catch (error) {
      return res.status(500).send({ errorMessage: err });
   }
};

const unfollowUser = async (req, res) => {
   try {
      UserDB.User.findOneAndUpdate({ _id: req.userID }, { $pull: { following: req.params.userid } }).exec(
         async (err, docs) => {
            if (!err) {
               try {
                  await UserDB.User.findOneAndUpdate(
                     { _id: req.params.userid },
                     { $pull: { followers: req.userID } }
                  ).exec();
                  return res.status(200).send({ successMessage: 'User successfully unfollowed' });
               } catch (err) {
                  return res.status(500).send({ errorMessage: 'User not found' });
               }
            }
         }
      );
   } catch (error) {
      return res.status(500).send({ errorMessage: err });
   }
};

const getTopUsers = async (req, res) => {
   const users = UserDB.User.find({}).sort({ followers: -1 }).limit(3);
   users.exec((err, users) => {
      if (!err) {
         return res.status(200).send(users);
      } else {
         return res.status(500).send({ errorMessage: err });
      }
   });
};

const getLocalGuides = async (req, res) => {
   let coords = [];
   coords[0] = req.body.lng;
   coords[1] = req.body.lat;

   let maxDistance = 10000;
   //maxDistance /= 6371;

   try {
      const users = await UserDB.User.find({
         location: {
            $near: {
               $geometry: {
                  type: 'Point',
                  coordinates: coords,
               },
               $maxDistance: maxDistance,
            },
         },
         isLocalGuide: true,
      }).exec();
      res.send(users);
   } catch (err) {
      res.send(err);
   }
};

module.exports = {
   submitLogin,
   register,
   verifyUser,
   getVerifiedUserData,
   updateUserProfile,
   updateUserPassword,
   deleteUser,
   getUsersByCharacter,
   getUserById,
   followUser,
   unfollowUser,
   getTopUsers,
   getLocalGuides,
   forgotPassword,
   resetPassword,
};
