require('dotenv').config();
const tokenDB = require('../models/refreshToken.model');
const jwt = require('jsonwebtoken');
const { isNull } = require('lodash');

/**
 * Creates a JWT from a user
 * @param {*} userMail Mail of the user
 * @param {*} userID ID of the user
 * @returns token for following requests (so that password does not have to be stored)
 */
const createAuthenticationTokens = (userMail, userID, userName, role) => {
   const accessToken = generateToken(userMail, userID, userName, role, true);
   const refreshToken = generateToken(userMail, userID, userName, role, false);
   const storeres = storeRefreshToken(refreshToken);
   console.log(`Store res ${storeres}`);
   if (!storeres) return undefined;
   return { accessToken: accessToken, refreshToken: refreshToken };
};

async function storeRefreshToken(tokenToStore) {
   const newRefreshToken = new tokenDB.tokenStorage({
      tokenPayload: tokenToStore,
      lastLookupTime: Date.now(),
   });
   try {
      const token = await newRefreshToken.save();
      console.log(token);
      return true;
   } catch (error) {
      console.error(error);
      return false;
   }
}

const generateToken = (userMail, userID, userName, role, isAccessToken) => {
   const tokenPayload = {
      userMail: userMail,
      userID: userID,
      userName: userName,
      userRole: role,
   };

   if (!isAccessToken) tokenPayload.lastLookupTime = Date.now();

   return isAccessToken
      ? jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
           expiresIn: '900000',
        })
      : jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET);
};

const lookupRefreshToken = async (refreshToken) => {
   const newTime = Date.now();
   console.log(newTime);
   let tempPayload = jwt.decode(refreshToken);
   tempPayload.lastLookupTime = newTime;
   const newPayload = jwt.sign(tempPayload, process.env.REFRESH_TOKEN_SECRET);
   const token = await tokenDB.tokenStorage
      .findOneAndUpdate(
         { tokenPayload: refreshToken },
         { lastLookupTime: newTime, tokenPayload: newPayload },
         { new: true }
      )
      .exec();
   console.log(`Lookup refresh token ${token}    ${token !== null}`);
   return token ? newPayload : null;
};

const deleteRefreshToken = async (refreshToken) => {
   return tokenDB.tokenStorage.findOneAndDelete({ tokenPayload: refreshToken }).exec();
};

module.exports = {
   createAuthenticationTokens,
   generateToken,
   lookupRefreshToken,
   deleteRefreshToken,
};
