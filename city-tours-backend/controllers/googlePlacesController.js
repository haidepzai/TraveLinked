const axios = require('axios');
require('dotenv').config();
const GooglePoiDB = require('../models/storedGooglePois');

const API_KEY = process.env.GOOGLE_API;
const url = process.env.GOOGLE_URI;

//https://maps.googleapis.com/maps/api/place/textsearch/json?query=Tokyo&key=AIzaSyCFfcCS1D1l9kYA120YBKSJ1T0EXojHVWU
const getGooglePlaceInfo = (req, res) => {
   axios
      .get(`${url}textsearch/json?query=` + req.body.name + `&key=${API_KEY}`)
      .then(function (response) {
         switch (response.data.status) {
            case 'OK':
               res.send(response.data);
               break;
            case 'INVALID_REQUEST':
               res.status(400).send({ errorMessage: 'Invalid request!' });
               break;
            default:
               res.status(500).send({ errorMessage: 'There was an error!' });
               break;
         }
      })
      .catch(function (error) {
         res.status(500).send({ errorMessage: 'There was an error!' });
      });
};

//https://maps.googleapis.com/maps/api/place/textsearch/json?query=tokyo+tower+point+of+interest&language=en&key=AIzaSyCFfcCS1D1l9kYA120YBKSJ1T0EXojHVWU
const getGooglePointsOfInterests = (req, res) => {
   axios
      .get(`${url}textsearch/json?query=` + req.body.name + '+point+of+interest' + `&key=${API_KEY}`)
      .then(function (response) {
         switch (response.data.status) {
            case 'OK':
               res.send(response.data);
               break;
            case 'INVALID_REQUEST':
               res.status(400).send({ errorMessage: 'Invalid request!' });
               break;
            default:
               res.status(500).send({ errorMessage: 'There was an error!' });
               break;
         }
      })
      .catch(function (error) {
         res.status(500).send({ errorMessage: 'There was an error!' });
      });
};

//https://maps.googleapis.com/maps/api/place/textsearch/json?query=tokyo+tower+point+of+interest&language=en&key=AIzaSyCFfcCS1D1l9kYA120YBKSJ1T0EXojHVWU&pagetoken=...
const getMoreGooglePOIs = (req, res) => {
   axios
      .get(
         `${url}textsearch/json?query=` +
            req.body.name +
            '+point+of+interest' +
            `&key=${API_KEY}` +
            `&pagetoken=${req.body.pageToken}`
      )
      .then(function (response) {
         switch (response.data.status) {
            case 'OK':
               res.send(response.data);
               break;
            case 'INVALID_REQUEST':
               res.status(400).send({ errorMessage: 'Invalid request!' });
               break;
            default:
               res.status(500).send({ errorMessage: 'There was an error!' });
               break;
         }
      })
      .catch(function (error) {
         res.status(500).send({ errorMessage: 'There was an error!' });
      });
};

//https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=ATtYBwI68JD_8td4OK3J_LT7qoJbrboGtpdvfFQyqP5TXZvRnMYBSoS53lSl_aCCVE2w4YQI7dlbhdHKJ0ysNk4mRLu95_kgaCQ5kmZ-4-zf7ZCPXo2vcLr4tAdHXdB69_SNeZY84btoqhC_4Kqak7xaTUe-YDGiRtW23lfcOCl_pIbMJpGU&key=AIzaSyCFfcCS1D1l9kYA120YBKSJ1T0EXojHVWU
const getGooglePhoto = (req, res) => {
   const requestUrl = `${url}photo?maxwidth=400&photoreference=` + req.query.photoref + `&key=${API_KEY}`;
   axios.get(requestUrl).then((axiosRes) => {
      res.send(axiosRes.request._redirectable._options.href);
   });
};
//https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=35.6585805,139.7454329&radius=1000&type=tourist_attraction&keyword=point+of+interest&key=AIzaSyCFfcCS1D1l9kYA120YBKSJ1T0EXojHVWU&language=en
const getNearbyPointsOfInterests = (req, res) => {
   const radius = 5000;
   axios
      .get(
         `${url}nearbysearch/json?location=` +
            `${req.body.lat},${req.body.lng}` +
            `&radius=${radius}` +
            '&type=tourist_attraction' +
            // '&keyword=point+of+interest' +
            `&key=${API_KEY}`
      )
      .then(function (response) {
         switch (response.data.status) {
            case 'OK':
               res.send(response.data);
               break;
            case 'ZERO_RESULTS':
               res.status(204).send({ errorMessage: 'No content found!' });
               break;
            case 'INVALID_REQUEST':
               res.status(400).send({ errorMessage: 'Invalid request!' });
               break;
            default:
               res.status(500).send({ errorMessage: 'There was an error!' });
               break;
         }
      })
      .catch(function (error) {
         res.status(500).send({ errorMessage: 'There was an error!' });
      });
};

const addGooglePoisToDB = async (sights, parent_id) => {
   let success = true;
   await sights.forEach(async (sight) => {
      const lng = sight.geometry.location.lng;
      const lat = sight.geometry.location.lat;
      if (sight.place_id) {
         const newGooglePoi = new GooglePoiDB.GooglePoi({
            name: sight.name,
            location: { type: 'Point', coordinates: [lng, lat] },
            place_id: sight.place_id,
            parent_id: parent_id,
         });
         try {
            await newGooglePoi.save();
         } catch (error) {
            success = false;
            return;
         }
      }
   });
   return success;
};

const deleteGooglePoiOfParent = async (parent_id) => {
   try {
      await GooglePoiDB.GooglePoi.remove({ parent_id: parent_id });
      return true;
   } catch (error) {
      return false;
   }
};

const deleteGooglePoisOnEdit = async (sights, parent_id) => {
   let success = true;
   const currentSightIDs = sights.map((sight) => {
      return sight.place_id;
   });
   try {
      await GooglePoiDB.GooglePoi.remove({ parent_id: parent_id, place_id: { $not: { $in: currentSightIDs } } }).exec();
   } catch (error) {
      success = false;
   }
   return success;
};

const addGooglePoisOnEdit = async (sights, parent_id) => {
   let success = true;
   await sights.forEach(async (sight) => {
      if (sight.place_id) {
         console.log('place id', sight.place_id);
         await GooglePoiDB.GooglePoi.find({ place_id: sight.place_id, parent_id: parent_id }, async (err, docs) => {
            console.log('id', sight.place_id);
            console.log('docs', docs.length);
            if (!err && docs.length === 0) {
               console.log('save mit id:', sights.place_id);
               const lng = sight.geometry.location.lng;
               const lat = sight.geometry.location.lat;
               const newGooglePoi = new GooglePoiDB.GooglePoi({
                  name: sight.name,
                  location: { type: 'Point', coordinates: [lng, lat] },
                  place_id: sight.place_id,
                  parent_id: parent_id,
               });
               try {
                  const saved = await newGooglePoi.save();
               } catch (error) {
                  success = false;
                  return;
               }
            }
         });
      }
   });
   return success;
};

const updateGooglePoisOnEdit = (sights, parent_id) => {
   const addSuccessfull = addGooglePoisOnEdit(sights, parent_id);
   const deleteSuccessfull = deleteGooglePoisOnEdit(sights, parent_id);
   return addSuccessfull && deleteSuccessfull;
};

module.exports = {
   getGooglePlaceInfo,
   getGooglePointsOfInterests,
   getGooglePhoto,
   getNearbyPointsOfInterests,
   getMoreGooglePOIs,
   addGooglePoisToDB,
   deleteGooglePoiOfParent,
   updateGooglePoisOnEdit,
};
