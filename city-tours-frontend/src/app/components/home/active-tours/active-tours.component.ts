import { Tour } from '../../../models/tour.model';
import { TourService } from 'src/app/services/requestServices/tour.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageHelperService } from 'src/app/services/image-helper.service';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';

@Component({
   selector: 'app-active-tours',
   templateUrl: './active-tours.component.html',
   styleUrls: ['./active-tours.component.css'],
})
export class ActiveToursComponent implements OnInit {
   isLoading = false;
   activeTours: Tour[] = [];

   constructor(private tourService: TourService, private router: Router, private tourImgService: ImageHelperService) {}

   ngOnInit(): void {
      this.isLoading = true;
      this.tourService.getActiveTours().subscribe(
         (data) => {
            this.activeTours = data;
            this.isLoading = false;
         },
         (error) => {
            console.log(error);
         }
      );
   }

   goToTourOverview(tourId: string | undefined): void {
      this.router.navigate([`/tour-detail-view/${tourId}`]);
   }

   getImageOfTour(src: string) {
      return `${ApiURLStore.GET_IMG}/${src}`;
   }
}
