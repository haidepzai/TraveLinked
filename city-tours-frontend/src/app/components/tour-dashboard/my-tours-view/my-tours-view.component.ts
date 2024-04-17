import { SnackBarService } from '../../../services/snack-bar.service';
import { Tour } from '../../../models/tour.model';
import { TourService } from 'src/app/services/requestServices/tour.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StdDeleteModalComponent } from '../../modals/std_delete-modal/std-delete-modal.component';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';

@Component({
   selector: 'app-my-tours-view',
   templateUrl: './my-tours-view.component.html',
   styleUrls: ['./my-tours-view.component.css'],
})
export class MyToursViewComponent implements OnInit {
   myTours: Tour[] = [];
   isLoading = false;
   onDelBtn = false;
   searchTerm: string;

   constructor(
      private tourService: TourService,
      private router: Router,
      private _modalService: NgbModal,
      private snackBar: SnackBarService
   ) {
      this.isLoading = true;
   }

   ngOnInit(): void {
      this.tourService.getOwnTours().subscribe(
         (data) => {
            this.myTours = data;
            this.isLoading = false;
         },
         (error) => {
            console.log(error);
            this.isLoading = false;
         }
      );
   }

   goToTourOverview(tourId: string | undefined): void {
      this.router.navigate([`/tour-detail-view/${tourId}`]);
   }

   deleteDialog(tourId: string | undefined, tourName: string | undefined): void {
      let confirmed = false;

      const modalRef = this._modalService.open(StdDeleteModalComponent);
      modalRef.componentInstance.contentStringID = 'MODAL.DELETE_TOUR';
      modalRef.componentInstance.additionalString = tourName; // send data to modal

      modalRef.result.then((result) => {
         confirmed = result;

         if (confirmed) {
            this.tourService.deleteTour(tourId).subscribe(
               (data) => {
                  // Delete tour from UI => filter tour by id
                  this.myTours = this.myTours.filter((tours) => tours._id !== tourId);
               },
               (error) => {
                  console.log(error);
               }
            );
            this.snackBar.showSnackBar('Tour successfully deleted', 5000, 'snackbar-success');
         }
      });
   }

   sortBy(indicator: string): void {
      switch (indicator) {
         case 'creationDate':
            this.myTours.sort(function (a, b) {
               if (a.createdAt < b.createdAt) {
                  return -1;
               }
               if (a.createdAt > b.createdAt) {
                  return 1;
               }
               return 0;
            });
            break;
         case 'startDate':
            this.myTours.sort(function (a, b) {
               if (a.startDate < b.startDate) {
                  return -1;
               }
               if (a.startDate > b.startDate) {
                  return 1;
               }
               return 0;
            });
            break;
         case 'alphabetical_az':
            this.myTours.sort(function (a, b) {
               if (a.name.toLowerCase() < b.name.toLowerCase()) {
                  return -1;
               }
               if (a.name.toLowerCase() > b.name.toLowerCase()) {
                  return 1;
               }
               return 0;
            });
            break;
         case 'alphabetical_za':
            this.myTours.sort(function (a, b) {
               if (a.name.toLowerCase() > b.name.toLowerCase()) {
                  return -1;
               }
               if (a.name.toLowerCase() < b.name.toLowerCase()) {
                  return 1;
               }
               return 0;
            });
            break;
         default:
            break;
      }
   }

   getPictureOfSight(src: string | undefined) {
      return src ? `${ApiURLStore.GET_IMG}/${src}` : `${ApiURLStore.GET_IMG}/defaultImage.png`;
   }
}
