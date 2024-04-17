const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ChatSchema = new Schema({
   clientOne: {
      type: String,
   },
   clientTwo: {
      type: String,
   },
   hasRead: {
      type: Boolean,
      default: false,
   },
   messages: {
      type: [
         {
            type: Object,
         },
      ],
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   updatedAt: {
      type: Date,
      default: Date.now,
   },
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = {
   Chat,
};
