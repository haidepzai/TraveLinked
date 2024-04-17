const _ = require('lodash');
const TourDB = require('../models/tour.model');
const UserDB = require('../models/user.model');
const moment = require('moment');
const imageStorageService = require('../services/imageStorageService');
const imageStorageController = require('./imageStorageController');
const googleController = require('./googlePlacesController');

const createTour = async (req, res) => {
   let newTour = new TourDB.Tour({
      name: req.body.tour.name,
      description: req.body.tour.description,
      creator: req.userID,
      created_at: req.body.tour.created_at,
      sights: req.body.tour.sights,
      likes: req.body.tour.likes,
      startDate: req.body.tour.startDate,
      endDate: req.body.tour.endDate,
      userName: req.body.tour.userName,
      cityName: req.body.tour.cityName,
   });
   newTour.save(async (err, doc) => {
      if (!err) {
         const googlePoi = await googleController.updateGooglePoisOnEdit(req.body.tour.sights, doc._id);
         if (!googlePoi) return res.status(500).send({ errorMessage: 'error on google poi' });
         return res.status(200).send(doc);
      } else {
         return res.status(500).send({ errorMessage: err });
      }
   });
};

const getOwnTours = async (req, res) => {
   try {
      const tours = await TourDB.Tour.find({ creator: req.userID }).exec();
      res.status(200).send(tours);
   } catch (err) {
      return res.status(500).send({ errorMessage: error });
   }
};

const getTour = async (req, res) => {
   try {
      const tour = await TourDB.Tour.findOne({ _id: req.params.tourid }).exec();
      return res.status(200).send(tour);
   } catch (err) {
      return res.status(500).send({ errorMessage: err });
   }
};

const getToursByUserID = async (req, res) => {
   try {
      const tours = await TourDB.Tour.find({ creator: req.params.userid }).exec();
      res.status(200).send(tours);
   } catch (err) {
      return res.status(500).send({ errorMessage: err });
   }
};

//TODO: Sollte eine funktion nutzen, die eine generische delete tour with id methode verwendet
/**
 * Handles a the tour deletion performed by the user
 * @param {*} req
 * @param {*} res
 * @returns
 */
const handleTourDeletion = async (req, res) => {
   const tour = await TourDB.Tour.findById({ _id: req.params.tourid }).exec();
   if (req.userID !== tour.creator) {
      return res.status(403).send({ errorMessage: 'Not allowed' });
   }
   deleteTourByID(req.params.tourid).then((deleteRes) => {
      if (deleteRes === true) {
         return res.status(200).send({ infoMessage: 'succesfully deleted tour' });
      }
      return res.status(500).send({ errorMessage: deleteRes });
   });
};

/**
 * Deletes a tour and the titleImage of tour
 * @param {id of the tour to delete} idToDelete
 * @returns true if successfull, error message else
 */
const deleteTourByID = async (idToDelete) => {
   try {
      const tourToDelete = await TourDB.Tour.findOneAndDelete({ _id: idToDelete }).exec();
      const imageURL = tourToDelete.titleImage.imageURL;
      let deleteImage = true;
      if (imageURL !== 'defaultImage.png') {
         deleteImage = await imageStorageService.deleteFile(imageURL);
      }
      if (deleteImage) {
         const googlePoi = await googleController.deleteGooglePoiOfParent(idToDelete);
         if (!googlePoi) return false;
         if (tourToDelete.photoGallery.length === 0) return true;
         return imageStorageController.deleteAllGalleryFiles(tourToDelete.photoGallery);
      }
      return 'error on deleting image file of tour';
   } catch (error) {
      return error;
   }
};

//TODO: Sollte delete tour nutzen
/**
 * Collects all tours of users + passes them to a delete method
 * @param {Id of the user to delet all tours} userID
 * @returns true if successfull, errorMessage else
 */
const clearToursOfUser = async (userID) => {
   let success = true;
   console.log('clear tours of user started');
   const tours = await TourDB.Tour.find({ creator: userID }).exec();
   for (const tour of tours) {
      const deleteRes = await deleteTourByID(tour._id);
      if (deleteRes !== true) {
         success = deleteRes;
         break;
      }
   }
   console.log('tours of user `${userId}` deleted');
   return Promise.resolve(success);
};

const getTopTours = async (req, res) => {
   const tours = TourDB.Tour.find({}).sort({ likes: -1 }).limit(3);
   tours.exec((err, tours) => {
      if (!err) {
         return res.status(200).send(tours);
      } else {
         return res.status(500).send({ errorMessage: err });
      }
   });
};

const editTour = async (req, res) => {
   const tour = await TourDB.Tour.findById({ _id: req.body.tour._id });

   if (req.userID !== tour.creator) {
      return res.status(401).send({ errorMessage: 'Not authorized' });
   }

   tour.name = req.body.tour.name;
   tour.description = req.body.tour.description;
   tour.sights = req.body.tour.sights;
   tour.startDate = req.body.tour.startDate;
   tour.endDate = req.body.tour.endDate;
   tour.cityName = req.body.tour.cityName;

   tour.save(async (err, doc) => {
      if (!err) {
         const googlePois = await googleController.updateGooglePoisOnEdit(req.body.tour.sights, req.body.tour._id);
         if (!googlePois) {
            return res.status(500).send({ errorMessage: 'error on editing google pois' });
         }
         return res.status(200).send(doc);
      } else {
         return res.status(500).send({ errorMessage: err });
      }
   });
};

const likeTour = async (req, res) => {
   try {
      TourDB.Tour.findOneAndUpdate(
         { _id: req.params.tourid },
         {
            $addToSet: { likedUsers: req.userID },
            $inc: { likes: 1 },
         }
      ).exec(async (err, docs) => {
         if (!err) {
            try {
               await UserDB.User.findOneAndUpdate({ _id: req.userID }, { $push: { likedTours: docs } }).exec();
               return res.status(200).send({ successMessage: 'Tour successfully liked' });
            } catch (err) {
               return res.status(500).send({ errorMessage: 'User not found' });
            }
         } else {
            return res.status(500).send({ errorMessage: 'Tour not found' });
         }
      });
   } catch (err) {
      return res.status(500).send({ errorMessage: err });
   }
};

const unlikeTour = async (req, res) => {
   try {
      TourDB.Tour.findOneAndUpdate(
         { _id: req.params.tourid },
         {
            $pull: { likedUsers: req.userID },
            $inc: { likes: -1 },
         }
      ).exec(async (err, docs) => {
         if (!err) {
            try {
               await UserDB.User.findOneAndUpdate(
                  { _id: req.userID },
                  { $pull: { likedTours: { _id: docs._id } } }
               ).exec();
               return res.status(200).send({ successMessage: 'Tour successfully unliked' });
            } catch (err) {
               return res.status(500).send({ errorMessage: 'User not found' });
            }
         } else {
            return res.status(500).send({ errorMessage: 'Tour not found' });
         }
      });
   } catch (err) {
      return res.status(500).send({ errorMessage: err });
   }
};

const getActiveTours = async (req, res) => {
   try {
      const activeTours = await TourDB.Tour.find({
         startDate: { $lt: moment().format() },
         endDate: { $gte: moment().format() },
      }).exec();
      res.status(200).send(activeTours);
   } catch (error) {
      return res.status(500).send({ errorMessage: error });
   }
};

const saveComments = async (req, res) => {
   const tour = await TourDB.Tour.findById({ _id: req.body.tourId });

   tour.comments = req.body.comments;

   tour.save(async (err, doc) => {
      if (!err) {
         return res.status(200).send(doc);
      } else {
         return res.status(500).send({ errorMessage: err });
      }
   });
};

const likeComment = async (req, res) => {
   try {
      const tour = await TourDB.Tour.findOneAndUpdate(
         { _id: req.body.tourId, 'comments._id': req.body.commentId },
         { $inc: { 'comments.$.likes': 1 }, $addToSet: { 'comments.$.likedUsers': req.userID } }
      ).exec();
      res.status(200).send(tour);
   } catch (err) {
      return res.status(500).send({ errorMessage: `An error occured: ${err}` });
   }
};

const unlikeComment = async (req, res) => {
   try {
      const tour = await TourDB.Tour.findOneAndUpdate(
         { _id: req.body.tourId, 'comments._id': req.body.commentId },
         { $inc: { 'comments.$.likes': -1 }, $pull: { 'comments.$.likedUsers': req.userID } }
      ).exec();
      res.status(200).send(tour);
   } catch (err) {
      return res.status(500).send({ errorMessage: `An error occured: ${err}` });
   }
};

const saveTodos = async (req, res) => {
   const tour = await TourDB.Tour.findById({ _id: req.body.tourId });

   tour.todos = req.body.todos;

   tour.save(async (err, doc) => {
      if (!err) {
         return res.status(200).send(doc);
      } else {
         return res.status(500).send({ errorMessage: err });
      }
   });
};

const shareTour = async (req, res) => {
   const tour = await TourDB.Tour.findById({ _id: req.params.tourid });

   if (req.userID !== tour.creator) {
      return res.status(401).send({ errorMessage: 'Not authorized' });
   }

   if (!tour.isShared) {
      tour.isShared = true;
   } else {
      tour.isShared = false;
   }

   tour.save(async (err, doc) => {
      if (!err) {
         return res.status(200).send(doc);
      } else {
         return res.status(500).send({ errorMessage: err });
      }
   });
};

const deleteGalleryImage = async (req, res) => {
   console.log(req.params);
   const userID = req.userID;
   const tourID = req.body.tourID;
   const imageID = req.params.imageID;
   try {
      await TourDB.Tour.updateOne(
         { _id: tourID, creator: userID },
         { $pull: { photoGallery: { imageURL: imageID } } }
      ).exec();
      imageStorageController
         .deleteSingleGalleryFile(imageID)
         .then((deleteRes) => {
            if (deleteRes === true) return res.status(200).send({ infoMessage: 'successfully deleted gallery file' });
            return res.status(500).send({ errorMessage: 'Unknown error on delte gallery file' });
         })
         .catch((err) => {
            return res.status(500).send({ errorMessage: err });
         });
   } catch (error) {
      return res.status(500).send({ errorMessage: error });
   }
};

module.exports = {
   createTour,
   getOwnTours,
   handleTourDeletion,
   clearToursOfUser,
   getTour,
   getTopTours,
   likeTour,
   unlikeTour,
   editTour,
   getActiveTours,
   saveComments,
   likeComment,
   unlikeComment,
   shareTour,
   saveTodos,
   getToursByUserID,
   deleteGalleryImage,
};
