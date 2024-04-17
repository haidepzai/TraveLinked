require('dotenv').config();
const jwt = require('jsonwebtoken');
const tokenService = require('./../services/tokenService');

/**
 * Immer diese Methode verwenden um zu prüfen, ob vom token an die userID zu kommen, da hier
 * geprüft wird, ob der token korrekt ist (sonst kann im token die id eines anderen users genutzt werden
 * und man bekommt unerlaubten zugriff)
 * */
const getVerifiedUserOfToken = (req, res, next) => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1]; //Bearer {Token}
   if (!token) {
      return res.status(500).send({
         errorMessage: 'Wrong authentication used, missing authentication token',
      });
   }
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenObj) => {
      if (err) {
         return res.status(401).send({ errorMessage: 'Token has been expired' });
      } else {
         req.userID = tokenObj.userID;
      }
      next();
   });
};

const getRefreshedToken = async (req, res) => {
   const refreshToken = req.body.refreshToken;
   if (!refreshToken) {
      return res.status(401).send({ errorMessage: 'Missing refresh Token' });
   }
   const tokenRefresh = await tokenService.lookupRefreshToken(refreshToken);
   if (!tokenRefresh) {
      return res.status(401).send({ errorMessage: 'invalid refresh token used' });
   }
   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
         return res.status(401).send({ errorMessage: 'invalid token' });
      }
      const newAccessToken = tokenService.generateToken(user.userMail, user.userID, user.userName, user.userRole, true);
      return res.status(200).send({ accessToken: newAccessToken, updatedRefreshToken: tokenRefresh });
   });
};

const deleteRefreshToken = async (req, res) => {
   const tokenToDelete = req.body.refreshToken;
   if (!tokenToDelete) {
      return res.status(500).send({ errorMessage: 'Missing refresh token to logout' });
   }
   const result = await tokenService.deleteRefreshToken(tokenToDelete);
   console.log(`result ${result}`);
   if (result) {
      return res.status(200).send({ success: true });
   }
   return res.status(500).send({ errorMessage: 'no refresh token to delete found' });
};

module.exports = {
   getVerifiedUserOfToken,
   getRefreshedToken,
   deleteRefreshToken,
};
