const Image = require('../models/imageFile.model');
const userDB = require('../models/user.model');
const tourDB = require('../models/tour.model');
const poiDB = require('../models/poi.model');
const imageStorageService = require('../services/imageStorageService');
const defaultImagePath = 'defaultImage.png';

const fileUpload = async (req, res) => {
   const fileName = req.file.filename; //file name defined in the service
   if (req.body.attachedTo === 'user') {
      const img = new Image(null, fileName);
      const userID = req.userID;
      userDB.User.findOneAndUpdate({ _id: userID }, { profilePicture: img }, { new: false })
         .exec()
         .then(async (doc) => {
            const oldFile = doc.profilePicture.imageURL;
            imageStorageService
               .deleteFile(oldFile)
               .then((deleteFileRes) => {
                  if (deleteFileRes) {
                     return res.status(200).send({ fileName: fileName });
                  }
               })
               .catch((err) => {
                  return res.status(500).send({ errorMessage: err });
               });
         })
         .catch((err) => {
            return res.status(500).send({ errorMessage: err });
         });
   } else if (req.body.attachedTo === 'tour') {
      const img = new Image(null, fileName);
      const tourID = req.body.idToAttach;
      tourDB.Tour.findOneAndUpdate({ _id: tourID }, { titleImage: img }, { new: false })
         .exec()
         .then(async (doc) => {
            const oldFile = doc.titleImage.imageURL;
            if (oldFile !== defaultImagePath) {
               imageStorageService
                  .deleteFile(oldFile)
                  .then((deleteFileRes) => {
                     if (deleteFileRes) {
                        return res.status(200).send({ fileName: fileName });
                     }
                  })
                  .catch((err) => {
                     return res.status(500).send({ errorMessage: err });
                  });
            }
         })
         .catch((err) => {
            return res.status(500).send({ errorMessage: err });
         });
   } else if (req.body.attachedTo === 'tourGallery') {
      const img = new Image(req.body.imageDescription, fileName);
      const tourID = req.body.idToAttach;
      try {
         await tourDB.Tour.findOneAndUpdate({ _id: tourID }, { $push: { photoGallery: img } }, { new: false }).exec();
         return res.status(200).send({ successMessage: 'Photo uploaded' });
      } catch (err) {
         return res.status(500).send({ errorMessage: err });
      }
   } else if (req.body.attachedTo === 'poi') {
      const img = new Image(null, fileName);
      const poiID = req.body.idToAttach;
      poiDB.Poi.findOneAndUpdate({ _id: poiID }, { titleImage: img }, { new: false })
         .exec()
         .then(async (doc) => {
            const oldFile = doc.titleImage.imageURL;
            if (oldFile !== defaultImagePath) {
               imageStorageService
                  .deleteFile(oldFile)
                  .then((deleteFileRes) => {
                     if (deleteFileRes) {
                        return res.status(200).send({ fileName: fileName });
                     }
                  })
                  .catch((err) => {
                     return res.status(500).send({ errorMessage: err });
                  });
            }
         })
         .catch((err) => {
            return res.status(500).send({ errorMessage: err });
         });
   } else {
      return res.status(500).send({
         errorMessage: 'Cannot upload a file that is not attached to a resource',
      });
   }
};

const getImg = (req, res) => {
   let publicPath = imageStorageService.getFullImgPath(req.params.imgID);
   return res.status(200).sendFile(publicPath);
};

const deleteSingleGalleryFile = async (fileIDToDelete) => {
   return imageStorageService.deleteFile(fileIDToDelete);
};

const deleteAllGalleryFiles = async (photoGallery) => {
   let success = true;
   for (const photo of photoGallery) {
      try {
         await imageStorageService.deleteFile(photo.imageURL);
      } catch (error) {
         success = false;
         break;
      }
   }
   return success;
};

module.exports = {
   fileUpload,
   getImg,
   deleteSingleGalleryFile,
   deleteAllGalleryFiles,
};
