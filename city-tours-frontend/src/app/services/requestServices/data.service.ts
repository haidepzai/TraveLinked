import { User } from './../../models/user.model';
import { Tour } from './../../models/tour.model';
import { UserStorageService } from '../user/user-storage.service';
import { PointOfInterest } from 'src/app/models/poi.model';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
   providedIn: 'root',
})
export class DataService {
   private PointOfInterestSource$ = new Subject<PointOfInterest[]>();
   private isLoadingSource$ = new Subject<boolean>();
   private navigateAwaySource$ = new Subject<boolean>();
   private ToursSource$ = new Subject<Tour[]>();
   private LocalGuideSource$ = new Subject<User[]>();

   private longitudeSource$ = new Subject<number>();
   private latitudeSource$ = new Subject<number>();

   constructor(private userStorageService: UserStorageService) {}

   public getLocations(): Observable<PointOfInterest[]> {
      return this.PointOfInterestSource$.asObservable();
   }

   public setLocations(gl: PointOfInterest[]): void {
      return this.PointOfInterestSource$.next(gl);
   }

   public getLoadingStatus(): Observable<boolean> {
      return this.isLoadingSource$.asObservable();
   }

   public setLoadingStatus(isLoading: boolean): void {
      return this.isLoadingSource$.next(isLoading);
   }

   public getNavigateAway(): Observable<boolean> {
      return this.navigateAwaySource$.asObservable();
   }

   public setNavigateAway(choice: boolean): void {
      return this.navigateAwaySource$.next(choice);
   }

   public getLongitude(): Observable<number> {
      return this.longitudeSource$.asObservable();
   }

   public setLongitude(lng: number): void {
      return this.longitudeSource$.next(lng);
   }

   public getLatitude(): Observable<number> {
      return this.latitudeSource$.asObservable();
   }

   public setLatitude(lat: number): void {
      return this.latitudeSource$.next(lat);
   }

   public getTours(): Observable<Tour[]> {
      return this.ToursSource$.asObservable();
   }

   public setTours(tours: Tour[]): void {
      return this.ToursSource$.next(tours);
   }

   public getLocalGuides(): Observable<User[]> {
      return this.LocalGuideSource$.asObservable();
   }

   public setLocalGuides(users: User[]): void {
      return this.LocalGuideSource$.next(users);
   }

   updateUserStorageOnLogin(userInformationContainingToken: string): void {
      const userObj = jwt_decode(userInformationContainingToken) as any;
      this.userStorageService.$email = userObj.userMail;
      this.userStorageService.$userID = userObj.userID;
      this.userStorageService.$userName = userObj.userName;
      this.userStorageService.$role = userObj.userRole;
      this.userStorageService.$loggedIn = true;
   }
}
