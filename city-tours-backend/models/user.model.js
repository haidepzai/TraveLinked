const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
const Image = require('./imageFile.model');
const Point = require('./point.model');

const UserSchema = new Schema(
   {
      fullName: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         match: [
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please enter a valid email',
         ],
      },
      hashedPassword: {
         type: String,
         required: true,
      },
      status: {
         type: String,
         enum: ['Pending', 'Active'],
         default: 'Pending',
      },
      confirmationCode: {
         type: String,
         unique: true,
      },
      resetPasswordCode: {
         type: String,
         required: false,
      },
      createdAt: {
         type: Date,
         default: Date.now,
      },
      role: {
         type: String,
         enum: ['Admin', 'User'],
         default: 'User',
      },
      likedTours: {
         type: [{ type: Object }],
      },
      followers: {
         type: [{ type: String }],
      },
      following: {
         type: [{ type: String }],
      },
      hometown: {
         type: String,
      },
      location: {
         type: Point.pointSchema,
         index: '2dsphere',
      },
      profileIsPublic: {
         type: Boolean,
         required: true,
         default: false,
      },
      profilePicture: {
         type: Object,
         required: false,
         default: new Image(null, 'missingProfilePicture.png'),
      },
      aboutMe: {
         type: String,
      },
      isLocalGuide: {
         type: Boolean,
         default: false,
      },
   },
   {
      versionKey: false,
   }
);

//Hash password when Register
UserSchema.statics.hashPassword = function hashPassword(password) {
   return bcrypt.hashSync(password, 10);
};
//Login
UserSchema.methods.isValid = function (purePassword) {
   return bcrypt.compareSync(purePassword, this.hashedPassword);
};

const User = mongoose.model('User', UserSchema);

module.exports = {
   User,
};
