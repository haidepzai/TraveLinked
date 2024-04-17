const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const pointSchema = new mongoose.Schema({
   type: {
      type: String,
      enum: ['Point'],
      required: true,
   },
   coordinates: {
      type: [Number],
      required: true,
   },
});

module.exports = { pointSchema };
