const multer = require('multer');
const path = require('path');
const fs = require('fs');

//Service used for defining path for uploaded images
//and for assigning image name

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './public/images'); //Path where images are saved
   },
   filename: (req, file, cb) => {
      var filetype = '';
      switch (file.mimetype) {
         case 'image/gif':
            filetype = 'gif';
            break;
         case 'image/png':
            filetype = 'png';
            break;
         case 'image/jpeg':
            filetype = 'jpg';
            break;
      }
      const imgName = `image-${req.userID}_${Date.now()}.${filetype}`;
      cb(null, imgName);
   },
});

let upload = multer({ storage: storage });

const getFullImgPath = (fileID) => {
   const imgURL = `../public/images/${fileID}`;
   return path.join(__dirname, imgURL);
};

const deleteFile = (fileID) => {
   if (fileID === 'missingProfilePicture.png') {
      return Promise.resolve(true);
   }
   const imgPath = getFullImgPath(fileID);
   console.log(imgPath);
   return new Promise((resolve, reject) => {
      fs.unlink(imgPath, (err) => {
         if (err) {
            console.error(err);
            reject(err);
         }
         resolve(true);
      });
   });
};

module.exports = {
   storage,
   upload,
   getFullImgPath,
   deleteFile,
};
