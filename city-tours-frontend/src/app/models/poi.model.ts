import { Image } from './fileUpload.model';

export interface GoogleResponse {
   results: PointOfInterest[];
   status: string;
   next_page_token?: string;
}

export interface PointOfInterest {
   _id?: string;
   name: string;
   geometry: Locations;
   creator?: string;
   createdAt: Date;
   description: string;
   imagePath?: string;
   titleImage?: Image;
   userName?: string;

   formatted_address?: string;
   vicinity?: string;
   photos?: PhotoInfo[];
   type?: string[];
   user_rating_total?: number;
}

export class Locations {
   constructor(public location: Geocoordinates) {}
}

export class Geocoordinates {
   constructor(public lat: number, public lng: number) {}
}

export class PhotoInfo {
   constructor(
      public height: number,
      public html_attributions: string[],
      public photo_reference: string,
      public width: number
   ) {}
}
