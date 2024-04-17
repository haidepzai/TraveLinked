export class ApiURLStore {
   static readonly BASE_URL: string = 'http://localhost:3000';
   static readonly LOGIN_URL: string = `${ApiURLStore.BASE_URL}/login`;
   static readonly REGISTER_URL: string = `${ApiURLStore.BASE_URL}/register`;
   static readonly FORGOT_PASSWORD_URL: string = `${ApiURLStore.BASE_URL}/forgotpassword`;
   static readonly RESET_PASSWORD_URL: string = `${ApiURLStore.BASE_URL}/resetpassword`;
   static readonly LOGOUT_URL: string = `${ApiURLStore.BASE_URL}/logout`;
   static readonly GET_CREATEDTOURS_URL: string = `${ApiURLStore.BASE_URL}/getCreatedTours`;
   static readonly REFRESH_TOKEN_URL: string = `${ApiURLStore.BASE_URL}/refreshToken`;
   static readonly CONFIRMATION_URL: string = `${ApiURLStore.BASE_URL}/confirm/`;
   static readonly CREATE_TOUR: string = `${ApiURLStore.BASE_URL}/createTour`;
   static readonly EDIT_TOUR: string = `${ApiURLStore.BASE_URL}/edittour`;
   static readonly SAVE_COMMENTS: string = `${ApiURLStore.BASE_URL}/savecomments`;
   static readonly GET_OWN_TOURS: string = `${ApiURLStore.BASE_URL}/getowntours`;
   static readonly GET_TOURS_BY_USER_ID: string = `${ApiURLStore.BASE_URL}/gettoursbyuserid`;
   static readonly GET_TOURS_BY_LOCATION: string = `${ApiURLStore.BASE_URL}/gettoursbylocation`;
   static readonly GET_TOURS_BY_POI_LOCATOIN: string = `${ApiURLStore.BASE_URL}/gettoursbypoilocation`;
   static readonly GET_TOUR_BY_ID: string = `${ApiURLStore.BASE_URL}/gettour`;
   static readonly DELETE_TOUR: string = `${ApiURLStore.BASE_URL}/deleteTour`;
   static readonly SHARE_TOUR: string = `${ApiURLStore.BASE_URL}/sharetour`;
   static readonly SAVE_TODOS: string = `${ApiURLStore.BASE_URL}/savetodos`;
   static readonly UPLOAD_IMG: string = `${ApiURLStore.BASE_URL}/uploadFile`;
   static readonly GET_IMG: string = `${ApiURLStore.BASE_URL}/public/images`;
   static readonly GET_CURRENT_USER_DATA: string = `${ApiURLStore.BASE_URL}/getCurrentUserInfo`;
   static readonly UPDATE_USER_DATA: string = `${ApiURLStore.BASE_URL}/updateUserProfile`;
   static readonly UPDATE_USER_PASSWORD: string = `${ApiURLStore.BASE_URL}/updateUserPassword`;
   static readonly DELETE_USER_PROFILE: string = `${ApiURLStore.BASE_URL}/deleteUser`;
   static readonly CREATE_POI: string = `${ApiURLStore.BASE_URL}/createPoi`;
   static readonly GET_POIS: string = `${ApiURLStore.BASE_URL}/getPois`;
   static readonly GET_POI: string = `${ApiURLStore.BASE_URL}/getPoi`;
   static readonly GET_POIS_OF_USER: string = `${ApiURLStore.BASE_URL}/getPoisOfUser`;
   static readonly DELETE_POI: string = `${ApiURLStore.BASE_URL}/deletePoi`;
   static readonly EDIT_POI: string = `${ApiURLStore.BASE_URL}/editPoi`;
   static readonly GET_TOP_TOURS: string = `${ApiURLStore.BASE_URL}/gettoptours`;
   static readonly GET_ACTIVE_TOURS: string = `${ApiURLStore.BASE_URL}/getactivetours`;
   static readonly LIKE_TOUR: string = `${ApiURLStore.BASE_URL}/liketour`;
   static readonly UNLIKE_TOUR: string = `${ApiURLStore.BASE_URL}/unliketour`;
   static readonly GET_GOOGLE_POIS: string = `${ApiURLStore.BASE_URL}/googlepoi`;
   static readonly GET_GOOGLE_MORE_POIS: string = `${ApiURLStore.BASE_URL}/getmoregooglepois`;
   static readonly GET_GOOGLE_LOCATION: string = `${ApiURLStore.BASE_URL}/googleplace`;
   static readonly GET_GOOGLE_IMAGE: string = `${ApiURLStore.BASE_URL}/googlephoto`;
   static readonly GET_GOOGLE_NEARBY_POIS: string = `${ApiURLStore.BASE_URL}/googlenearbypoi`;
   static readonly GET_WEATHER_BY_LOCATION: string = `${ApiURLStore.BASE_URL}/getweatherbylocation`;
   static readonly GET_WEATHER_BY_COORDINATES: string = `${ApiURLStore.BASE_URL}/getweatherbycoordinates`;
   static readonly GET_USERS_BY_CHAR: string = `${ApiURLStore.BASE_URL}/getusersbycharacter`;
   static readonly GET_USER_BY_ID: string = `${ApiURLStore.BASE_URL}/getuserbyid`;
   static readonly SAVE_CHAT_MESSAGE: string = `${ApiURLStore.BASE_URL}/savechatmessage`;
   static readonly GET_CHAT_MESSAGES: string = `${ApiURLStore.BASE_URL}/getchatmessages`;
   static readonly FOLLOW_USER: string = `${ApiURLStore.BASE_URL}/followuser`;
   static readonly UNFOLLOW_USER: string = `${ApiURLStore.BASE_URL}/unfollowuser`;
   static readonly GET_TOP_USERS: string = `${ApiURLStore.BASE_URL}/gettopusers`;
   static readonly GET_LOCAL_GUIDES: string = `${ApiURLStore.BASE_URL}/getlocalguides`;
   static readonly GET_CONTACTED_USERS: string = `${ApiURLStore.BASE_URL}/getcontactedusers`;
   static readonly READ_MESSAGE: string = `${ApiURLStore.BASE_URL}/readmessage`;
   static readonly GET_UNREAD_MESSAGES: string = `${ApiURLStore.BASE_URL}/getunreadmessages`;
   static readonly LIKE_COMMENT: string = `${ApiURLStore.BASE_URL}/likeComment`;
   static readonly UNLIKE_COMMENT: string = `${ApiURLStore.BASE_URL}/unlikeComment`;
   static readonly SEND_CONTACT_FORM: string = `${ApiURLStore.BASE_URL}/sendcontactform`;
   static readonly DELETE_GALLERY_IMAGE_FILE: string = `${ApiURLStore.BASE_URL}/deletegalleryfile/`;
}
