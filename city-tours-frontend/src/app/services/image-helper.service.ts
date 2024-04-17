import { Injectable } from '@angular/core';
import { ApiURLStore } from '../models/ApiURLs/ApiURLStore';
import { PointOfInterest } from '../models/poi.model';
import { Tour } from '../models/tour.model';
import { User } from '../models/user.model';
import { UserRequestsService } from './requestServices/user-requests.service';

@Injectable({ providedIn: 'root' })
export class ImageHelperService {
   constructor(private userRequestsService: UserRequestsService) {}

   private profilePicMap: Map<string, string> = new Map<string, string>();

   public getUserProfilePicOfTour(userID: string): string {
      return this.profilePicMap.get(userID)!;
   }

   /**
    * Returns a map with the url of the owner img and the tour id
    * @param tours tours to get the profile pics
    */
   initializeProfilePicMap(tours: Tour[]): void {
      let tourProfilePicMap: Map<string, string> = new Map<string, string>();
      tours.forEach((tour) => {
         if (!tour._id) return;
         this.userRequestsService.getUserById(tour.creator!).subscribe(
            (userData: User) => {
               tourProfilePicMap.set(tour._id!, `${ApiURLStore.GET_IMG}/${userData.profilePicture?.imageURL}`);
            },
            (error) => {
               tourProfilePicMap.set(tour._id!, `${ApiURLStore.GET_IMG}/missingProfilePicture.png`);
            }
         );
      });
      this.profilePicMap = tourProfilePicMap;
   }

   /*    /**
    * Returns a map with the url of the title img and the tour id
    * @param tours tours to get the title pics
    
   getTitlePicMap(tours: Tour[]): Map<string, string> {
      let tourTitlePicMap: Map<string, string> = new Map<string, string>();
      tours.forEach((tour) => {
         if (!tour._id) return;
         tourTitlePicMap.set(tour._id, `${ApiURLStore.GET_IMG}/${tour.titleImage!.imageURL}`);
      });
      return tourTitlePicMap;
   } */

   /**
    * Returns a map with the url of the title img and the tour id
    * @param tours tours to get the title pics
    */
   getPoiImageMap(pois: PointOfInterest[]): Map<string, string> {
      let poiImageMap: Map<string, string> = new Map<string, string>();
      pois.forEach((poi) => {
         if (!poi._id) return;
         poiImageMap.set(poi._id, `${ApiURLStore.GET_IMG}/${poi.titleImage!.imageURL}`);
      });
      return poiImageMap;
   }
}
