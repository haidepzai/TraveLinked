import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';
import { User } from 'src/app/models/user.model';
import { UserRequestsService } from 'src/app/services/requestServices/user-requests.service';
import { GoogleService } from 'src/app/services/requestServices/google.service';
import { Router } from '@angular/router';
import { Tour } from '../../models/tour.model';
import { DataService } from 'src/app/services/requestServices/data.service';
import { Component, OnInit } from '@angular/core';
import { ImageHelperService } from 'src/app/services/image-helper.service';

@Component({
   selector: 'app-tour-result-view',
   templateUrl: './tour-result-view.component.html',
   styleUrls: ['./tour-result-view.component.css'],
})
export class TourResultViewComponent implements OnInit {
   lng: number;
   lat: number;
   locationName: string = '';
   tours: Tour[];

   isLoading: boolean = false;

   constructor(
      private ds: DataService,
      private router: Router,
      private gs: GoogleService,
      private userService: UserRequestsService,
      public tourImageService: ImageHelperService
   ) {
      this.ds.getLoadingStatus().subscribe((status) => (this.isLoading = status));
      this.isLoading = true;
   }

   ngOnInit(): void {
      this.ds.getLongitude().subscribe((lng) => {
         this.lng = lng;
      });
      this.ds.getLatitude().subscribe((lat) => {
         this.lat = lat;
      });
      this.ds.getTours().subscribe((tours: Tour[]) => {
         this.tours = tours;
         this.tourImageService.initializeProfilePicMap(tours);
         this.isLoading = false;
         this.ds.setLoadingStatus(this.isLoading);
      });
      this.gs.getLocationName().subscribe((name) => {
         this.locationName = name;
      });
   }

   goToTourOverview(tourId: string | undefined): void {
      this.router.navigate([`/tour-detail-view/${tourId}`]);
   }

   getImageOfTour(src: string) {
      return `${ApiURLStore.GET_IMG}/${src}`;
   }
}
