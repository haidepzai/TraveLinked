const router = require('express').Router();

const googlePlacesController = require('../controllers/googlePlacesController');
const userController = require('../controllers/userController');
const tokenController = require('../controllers/tokenController');
const tourController = require('../controllers/tourController');
const imgStorageService = require('../services/imageStorageService');
const imgStorageController = require('../controllers/imageStorageController');
const poiController = require('../controllers/poiController');
const weatherController = require('../controllers/weatherController');
const chatController = require('../controllers/chatController');
const contactFormController = require('../controllers/contactFormController');

//Routes:
//TODO: Add routes...
router.get('/', (req, res) => {
   res.send('Hello World');
});

//Authentication
router.post('/login', userController.submitLogin);
router.delete('/logout', tokenController.deleteRefreshToken);
router.post('/register', userController.register);
router.post('/forgotpassword', userController.forgotPassword);
router.get('/confirm/:confirmationCode', userController.verifyUser);
router.post('/resetpassword', userController.resetPassword);
router.post('/refreshToken', tokenController.getRefreshedToken);
//Google Endpoints
router.post('/googleplace', googlePlacesController.getGooglePlaceInfo);
router.post('/googlepoi', googlePlacesController.getGooglePointsOfInterests);
router.post('/googlenearbypoi', googlePlacesController.getNearbyPointsOfInterests);
router.post('/getmoregooglepois', googlePlacesController.getMoreGooglePOIs);
router.get('/googlephoto', googlePlacesController.getGooglePhoto);
//Tour Endpoints
router.post('/createTour', tokenController.getVerifiedUserOfToken, (req, res) => tourController.createTour(req, res));
router.get('/getowntours', tokenController.getVerifiedUserOfToken, (req, res) => tourController.getOwnTours(req, res));
router.get('/gettour/:tourid', tourController.getTour);
router.get('/gettoptours', tourController.getTopTours);
router.get('/gettoursbyuserid/:userid', tourController.getToursByUserID);

router.get('/getactivetours', tourController.getActiveTours);
router.delete('/deleteTour/:tourid', tokenController.getVerifiedUserOfToken, (req, res) =>
   tourController.handleTourDeletion(req, res)
);
router.put('/liketour/:tourid', tokenController.getVerifiedUserOfToken, (req, res) =>
   tourController.likeTour(req, res)
);
router.put('/unliketour/:tourid', tokenController.getVerifiedUserOfToken, (req, res) =>
   tourController.unlikeTour(req, res)
);
router.put('/edittour', tokenController.getVerifiedUserOfToken, (req, res) => tourController.editTour(req, res));
router.put('/sharetour/:tourid', tokenController.getVerifiedUserOfToken, (req, res) =>
   tourController.shareTour(req, res)
);
router.post('/savecomments', tokenController.getVerifiedUserOfToken, (req, res) =>
   tourController.saveComments(req, res)
);
router.post('/likeComment', tokenController.getVerifiedUserOfToken, (req, res) => tourController.likeComment(req, res));
router.post('/unlikeComment', tokenController.getVerifiedUserOfToken, (req, res) =>
   tourController.unlikeComment(req, res)
);
router.post('/savetodos', tokenController.getVerifiedUserOfToken, (req, res) => tourController.saveTodos(req, res));
// POI Endpoints
router.post('/createPoi', tokenController.getVerifiedUserOfToken, (req, res) => poiController.createPoi(req, res));
router.get('/getPois', poiController.getPois);
router.get('/getPoisOfUser', tokenController.getVerifiedUserOfToken, (req, res) =>
   poiController.getPoisOfUser(req, res)
);
router.get('/getPoi/:poiid', poiController.getPoi);
router.delete('/deletePoi/:poiid', tokenController.getVerifiedUserOfToken, (req, res) =>
   poiController.deletePoi(req, res)
);
router.put('/editPoi', tokenController.getVerifiedUserOfToken, (req, res) => poiController.editPoi(req, res));
//User Endpoints
router.get('/getuserbyid/:userid', userController.getUserById);
router.get('/getusersbycharacter/:username', tokenController.getVerifiedUserOfToken, (req, res) =>
   userController.getUsersByCharacter(req, res)
);
router.get('/getCurrentUserInfo', tokenController.getVerifiedUserOfToken, (req, res) =>
   userController.getVerifiedUserData(req, res)
);
router.post('/updateUserProfile', tokenController.getVerifiedUserOfToken, (req, res) =>
   userController.updateUserProfile(req, res)
);
router.post('/updateUserPassword', tokenController.getVerifiedUserOfToken, (req, res) =>
   userController.updateUserPassword(req, res)
);
router.delete('/deleteUser', tokenController.getVerifiedUserOfToken, (req, res) => userController.deleteUser(req, res));
router.put('/followuser/:userid', tokenController.getVerifiedUserOfToken, (req, res) =>
   userController.followUser(req, res)
);
router.put('/unfollowuser/:userid', tokenController.getVerifiedUserOfToken, (req, res) =>
   userController.unfollowUser(req, res)
);
router.get('/gettopusers', userController.getTopUsers);
router.post('/getlocalguides', userController.getLocalGuides);
//Weather Endpoints
router.get('/getweatherbylocation', weatherController.getWeatherByLocation);
router.get('/getweatherbycoordinates', weatherController.getWeatherByCoordinates);
// Other Endpoints
router.get('/public/images/:imgID', imgStorageController.getImg);
router.post(
   '/uploadFile',
   [tokenController.getVerifiedUserOfToken, imgStorageService.upload.single('file')],
   (req, res) => imgStorageController.fileUpload(req, res)
);
router.delete('/deletegalleryfile/:imageID', tokenController.getVerifiedUserOfToken, tourController.deleteGalleryImage);
// Chat Endpoints
router.post('/savechatmessage', chatController.saveChat);
router.post('/getchatmessages', chatController.loadChat);
router.post('/readmessage', chatController.readMessage);
router.get('/getunreadmessages/:userID', chatController.getUnreadMessages);
router.get('/getcontactedusers/:userID', chatController.getContactedUsers);
router.post('/gettoursbypoilocation', poiController.getPoisByRadius);
router.post('/sendcontactform', contactFormController.sendContactMessage);

module.exports = router;
