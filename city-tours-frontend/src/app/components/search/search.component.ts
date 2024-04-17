import { User } from './../../models/user.model';
import { UserRequestsService } from 'src/app/services/requestServices/user-requests.service';
import { Tour } from './../../models/tour.model';
import { TourService } from './../../services/requestServices/tour.service';
import { DataService } from './../../services/requestServices/data.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { GoogleService } from 'src/app/services/requestServices/google.service';
import { Router } from '@angular/router';
import { GoogleResponse, PointOfInterest } from 'src/app/models/poi.model';

@Component({
   selector: 'app-search',
   templateUrl: './search.component.html',
   styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
   @Output() poiList = new EventEmitter<PointOfInterest[]>();

   // Properties for Google API
   private lng: number;
   private lat: number;
   private name: string;

   mode: string = 'tours';

   private listOfPoi: PointOfInterest[];
   private tours: Tour[];
   private users: User[];
   isLoading: boolean = false;

   constructor(
      private gs: GoogleService,
      private ds: DataService,
      private router: Router,
      private ts: TourService,
      private us: UserRequestsService
   ) {}

   ngOnInit(): void {
      this.ds.getLocations().subscribe((loc) => (this.listOfPoi = loc));
   }

   // search for a location and get its geo-coordinates
   searchLocation(location: string): void {
      this.gs
         .getLocationInfo(location)
         .pipe(
            tap((data: GoogleResponse) => {
               if (data.status === 'OK') {
                  this.lng = data.results[0].geometry.location.lng;
                  this.lat = data.results[0].geometry.location.lat;
                  this.name = data.results[0].name;
               }
            }),
            map((response) => response)
         )
         .subscribe((data: GoogleResponse) => {
            if (this.mode === 'tours') {
               this.getTours();
            } else if (this.mode === 'guides') {
               this.getLocalGuides();
            }
         });
   }

   getTours(): void {
      this.isLoading = true;
      this.ds.setLoadingStatus(this.isLoading);
      this.router.navigate(['/tours-view']);

      this.ts.getTourByPoiLocation(this.lng, this.lat).subscribe((tours: Tour[]) => {
         this.tours = tours;
         this.ds.setTours(this.tours);
         this.gs.setLocationName(this.name);
      });
   }

   getLocalGuides(): void {
      this.isLoading = true;
      this.ds.setLoadingStatus(this.isLoading);
      this.router.navigate(['/local-guides']);

      this.us.getLocalGuides(this.lng, this.lat).subscribe((users: User[]) => {
         this.users = users;
         this.ds.setLocalGuides(this.users);
         this.gs.setLocationName(this.name);
      });
   }

   changeMode($event: string): void {
      this.mode = $event;
   }
}
