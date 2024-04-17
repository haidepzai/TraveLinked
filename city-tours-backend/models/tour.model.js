const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Point = require('./point.model');
const Image = require('./imageFile.model');
const Poi = require('./poi.model');

const TourSchema = new Schema({
   name: {
      type: String,
   },
   description: {
      type: String,
   },
   titleImage: {
      type: Object,
      required: false,
      default: new Image(null, 'defaultImage.png'),
   },
   photoGallery: {
      type: [{ type: Object }],
   },
   creator: {
      type: String,
   },
   userName: {
      type: String,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   sights: {
      type: [
         {
            type: Object,
            location: {
               type: Point.pointSchema,
               index: '2dsphere',
            },
         },
      ],
   },
   likes: {
      type: Number,
      default: 0,
   },
   likedUsers: {
      type: [
         {
            type: String,
         },
      ],
   },
   startDate: {
      type: Date,
   },
   endDate: {
      type: Date,
   },
   comments: {
      type: [
         {
            type: Object,
         },
      ],
   },
   cityName: {
      type: String,
   },
   isShared: {
      type: Boolean,
      default: false,
   },
   todos: {
      type: [
         {
            type: Object,
         },
      ],
   },
});

const Tour = mongoose.model('Tour', TourSchema);

//TourSchema.index({sights: '2dsphere'})

module.exports = {
   Tour,
};
