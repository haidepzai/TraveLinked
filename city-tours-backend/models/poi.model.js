const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Image = require('./imageFile.model');
const Point = require('./point.model');

const PoiSchema = new Schema({
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
   address: {
      type: String,
   },
   geometry: {
      type: Object,
   },
   location: {
      type: Point.pointSchema,
      index: '2dsphere',
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
});

const Poi = mongoose.model('Poi', PoiSchema);

module.exports = {
   Poi,
};
