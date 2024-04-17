const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const RefreshToken = new Schema({
   tokenPayload: { type: String },
   lastLookupTime: { type: Date, expires: '86400s', default: Date.now },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

//RefreshToken.index({ lastLookupTime: 1 }, { expireAfterSeconds: 86400 });

const tokenStorage = mongoose.model('tokenStorage', RefreshToken);

module.exports = {
   tokenStorage,
};
