const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Point = require('./point.model');

const GooglePoiSchema = new Schema({
   name: {
      type: String,
   },
   location: {
      type: Point.pointSchema,
      index: '2dsphere',
   },
   place_id: {
      type: String,
   },
   parent_id: {
      type: String,
   },
});

const GooglePoi = mongoose.model('StoredGooglePoi', GooglePoiSchema);

module.exports = {
   GooglePoi,
};
