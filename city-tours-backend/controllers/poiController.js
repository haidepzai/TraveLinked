const _ = require('lodash');
const PoiDB = require('../models/poi.model');
const imageStorageService = require('../services/imageStorageService');
const TourDB = require('../models/tour.model');
const GooglePoiDB = require('../models/storedGooglePois');

const createPoi = async (req, res) => {
   console.log(req.body.poi.geometry.location);
   let newPoi = new PoiDB.Poi({
      name: req.body.poi.name,
      description: req.body.poi.description,
      imagePath: req.body.poi.imagePath,
      address: req.body.poi.address,
      geometry: req.body.poi.geometry,
      creator: req.userID,
      userName: req.body.poi.userName,
      created_at: req.body.poi.created_at,
      location: {
         type: 'Point',
         coordinates: [req.body.poi.geometry.location['lng'], req.body.poi.geometry.location['lat']],
      },
   });

   newPoi.save(async (err, doc) => {
      if (!err) {
         return res.status(200).send(doc);
      } else {
         console.log('Error');
         return res.status(500).send({ errorMessage: err });
      }
   });
};

const getPois = async (req, res) => {
   const pois = await PoiDB.Poi.find().exec();
   res.send(pois);
};

const getPoisOfUser = async (req, res) => {
   try {
      const pois = await PoiDB.Poi.find({ creator: req.userID }).exec();
      res.send(pois);
   } catch (err) {
      return res.status(500).send({ errorMessage: error });
   }
};

const getPoi = async (req, res) => {
   try {
      const poi = await PoiDB.Poi.findOne({ _id: req.params.poiid }).exec();
      res.send(poi);
   } catch (err) {
      return res.status(500).send({ errorMessage: err });
   }
};

const deletePoi = async (req, res) => {
   const poi = await PoiDB.Poi.findById({ _id: req.params.poiid });

   if (req.userID !== poi.creator) {
      return res.status(401).send({ errorMessage: 'Not authorized' });
   }

   try {
      const poiToDelete = await PoiDB.Poi.findOneAndDelete({ _id: req.params.poiid }).exec();
      const imgURL = poiToDelete.titleImage.imageURL;
      let deleteImage = true;
      if (imgURL !== 'defaultImage.png') {
         deleteImage = await imageStorageService.deleteFile(imgURL);
      }
      if (deleteImage === true) return res.status(200).send({ successMessage: 'Poi successfully deleted!' });
      return res.status(500).send({ errorMessage: deleteImage });
   } catch (error) {
      console.error(error);
      return res.status(500).send({ errorMessage: error });
   }
};

const editPoi = async (req, res) => {
   const poi = await PoiDB.Poi.findById({ _id: req.body.poi._id });

   if (req.userID !== poi.creator) {
      return res.status(401).send({ errorMessage: 'Not authorized' });
   }

   poi.name = req.body.poi.name;
   poi.description = req.body.poi.description;
   poi.address = req.body.poi.address;
   poi.imagePath = req.body.poi.imagePath;
   poi.geometry = req.body.poi.geometry;

   poi.save(async (err, doc) => {
      if (!err) {
         return res.status(200).send(doc);
      } else {
         return res.status(500).send({ errorMessage: err });
      }
   });
};

const getPoisByRadius = async (req, res) => {
   let coords = [];
   coords[0] = req.body.lng;
   coords[1] = req.body.lat;
   let maxDistance = 15000;
   let place_id_list = [];

   await GooglePoiDB.GooglePoi.find(
      {
         location: {
            $near: {
               $geometry: {
                  type: 'Point',
                  coordinates: coords,
               },
               $maxDistance: maxDistance,
            },
         },
      },
      'place_id',
      async (err, result) => {
         if (err) return res.status(500).send({ errorMessage: err });
         place_id_list = result.map((elem) => {
            return String(elem.place_id);
         });
      }
   );

   await PoiDB.Poi.find(
      {
         location: {
            $near: {
               $geometry: {
                  type: 'Point',
                  coordinates: coords,
               },
               $maxDistance: maxDistance,
            },
         },
      },
      '_id',
      async (err, result) => {
         if (err) return res.status(500).send({ errorMessage: err });
         const idResArray = result.map((elem) => {
            return String(elem._id);
         });
         const toursWithPoi = await TourDB.Tour.find({
            $or: [{ 'sights._id': { $in: idResArray } }, { 'sights.place_id': { $in: place_id_list } }],
         }).exec();
         return res.status(200).send(toursWithPoi);
      }
   );
};

module.exports = {
   createPoi,
   getPois,
   getPoi,
   deletePoi,
   editPoi,
   getPoisOfUser,
   getPoisByRadius,
};
