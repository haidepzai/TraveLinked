const createLandmarkDoc = function (lng, lat) {
   return {
      type: 'Point',
      coordinates: [lng, lat],
   };
};

module.exports = { createLandmarkDoc };
