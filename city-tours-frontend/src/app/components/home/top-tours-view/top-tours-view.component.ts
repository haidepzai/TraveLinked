import { TourService } from 'src/app/services/requestServices/tour.service';
import { Tour } from '../../../models/tour.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageHelperService } from 'src/app/services/image-helper.service';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';

@Component({
   selector: 'app-top-tours-view',
   templateUrl: './top-tours-view.component.html',
   styleUrls: ['./top-tours-view.component.css'],
})
export class TopToursViewComponent implements OnInit {
   isLoading = false;
   topTours: Tour[] = [];
   onDelBtn = false;

   constructor(public tourPicService: ImageHelperService, private tourService: TourService, private router: Router) {}

   ngOnInit(): void {
      this.isLoading = true;
      this.tourService.getTopTours().subscribe(
         (data) => {
            this.topTours = data;
            this.isLoading = false;
            this.tourPicService.initializeProfilePicMap(this.topTours);
         },
         (error) => {
            console.log(error);
         }
      );
   }

   goToTourOverview(tourId: string | undefined): void {
      this.router.navigate([`/tour-detail-view/${tourId}`]);
   }

   getTitleImage(src: string) {
      return `${ApiURLStore.GET_IMG}/${src}`;
   }
}
