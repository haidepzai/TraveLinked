import { Tour } from './tour.model';
import { Image } from './fileUpload.model';
export interface User {
   _id: string;
   fullName: string;
   email: string;
   hometown?: string;
   location?: number[];
   role: string;
   status: string;
   likedTours?: Tour[];
   aboutMe?: string;
   profilePicture?: Image;
   createdAt?: Date;
   followers?: string[];
   following?: string[];
   isLocalGuide?: boolean;
   profileIsPublic?: boolean;
}
