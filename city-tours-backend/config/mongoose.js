const mongoose = require('mongoose');

mongoose.connect(
   process.env.MONGODB_URI,
   { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
   (err) => {
      if (!err) {
         console.log('MongoDB connection succeeded.');
      } else {
         console.log('Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2));
      }
   }
);

mongoose.set('useFindAndModify', false);

require('./../models/user.model');
require('./../models/tour.model');
