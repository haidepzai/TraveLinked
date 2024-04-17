const { result } = require('lodash');
const _ = require('lodash');
const ChatDB = require('../models/chat.model');
const UserDB = require('../models/user.model');

const saveChat = async (req, res) => {
   var query = {
         $or: [
            {
               clientOne: req.body.chat.senderID,
               clientTwo: req.body.chat.receiverID,
            },
            {
               clientTwo: req.body.chat.senderID,
               clientOne: req.body.chat.receiverID,
            },
         ],
      },
      update = {
         clientOne: req.body.chat.senderID,
         clientTwo: req.body.chat.receiverID,
         updatedAt: new Date(),
         hasRead: false,
         $push: {
            messages: {
               message: req.body.chat.message,
               senderID: req.body.chat.senderID,
               user: req.body.chat.senderName,
               date: new Date(),
            },
         },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };

   try {
      await ChatDB.Chat.findOneAndUpdate(query, update, options).exec();
      return res.status(200).send({ successMessage: 'Chat saved' });
   } catch (err) {
      return res.status(500).send({ errorMessage: 'User not found' });
   }
};

const loadChat = async (req, res) => {
   try {
      const chat = await ChatDB.Chat.findOne({
         $or: [
            {
               clientOne: req.body.senderID,
               clientTwo: req.body.receiverID,
            },
            {
               clientTwo: req.body.senderID,
               clientOne: req.body.receiverID,
            },
         ],
      }).exec();
      res.status(200).send(chat);
   } catch (err) {
      return res.status(500).send({ errorMessage: err });
   }
};

const getContactedUsers = async (req, res) => {
   try {
      const userID_One = await ChatDB.Chat.find(
         {
            clientOne: req.params.userID,
         },
         'clientTwo updatedAt'
      ).exec();
      const userID_Two = await ChatDB.Chat.find(
         {
            clientTwo: req.params.userID,
         },
         'clientOne updatedAt'
      ).exec();
      const userIDs = userID_One.concat(userID_Two).sort((a, b) => {
         return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
      //just get the ID of receiver
      const values = userIDs.map((x) => x.clientOne ?? x.clientTwo);
      //for each ID get the user
      const users = [];
      for (let i = 0; i < values.length; i++) {
         users.push(await UserDB.User.findById({ _id: values[i] }).exec());
      }
      res.status(200).send(users);
   } catch (err) {
      return res.status(500).send({ errorMessage: err });
   }
};

const readMessage = async (req, res) => {
   try {
      const chat = await ChatDB.Chat.findOneAndUpdate(
         {
            clientOne: req.body.senderID,
            clientTwo: req.body.receiverID,
         },
         { hasRead: true }
      ).exec();
      res.status(200).send(chat);
   } catch (err) {
      return res.status(500).send({ errorMessage: err });
   }
};

const getUnreadMessages = async (req, res) => {
   try {
      const chats = await ChatDB.Chat.find({
         clientTwo: req.params.userID,
         hasRead: false,
      })
         .sort({ updatedAt: -1 })
         .exec();
      res.status(200).send(chats);
   } catch (err) {
      return res.status(500).send({ errorMessage: err });
   }
};

module.exports = {
   saveChat,
   loadChat,
   getContactedUsers,
   readMessage,
   getUnreadMessages,
};
