import { Comments } from './comment.model';
import { Image } from './fileUpload.model';
import { PointOfInterest, Locations } from './poi.model';
import { ToDo } from './todo.model';
export interface Tour {
   _id?: string;
   name: string;
   description: string;
   titleImage?: Image;
   creator?: string;
   userName?: string;
   createdAt: Date;
   sights: PointOfInterest[];
   likes: number;
   likedUsers?: string[];
   startDate: Date;
   endDate: Date;
   comments?: Comments[];
   cityName: string;
   isShared?: boolean;
   todos?: ToDo[];
   photoGallery?: Image[];
}
