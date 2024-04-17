import { Tour } from '../../../models/tour.model';
import { TourService } from 'src/app/services/requestServices/tour.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { UserRequestsService } from 'src/app/services/requestServices/user-requests.service';
import { UserStorageService } from 'src/app/services/user/user-storage.service';
import { User } from 'src/app/models/user.model';
import { tap } from 'rxjs/operators';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';

@Component({
   selector: 'app-liked-tours',
   templateUrl: './liked-tours.component.html',
   styleUrls: ['./liked-tours.component.css'],
})
export class LikedToursComponent implements OnInit {
   likedTours: Tour[] | undefined;
   isLoading: boolean = false;
   unlikeBtn: boolean = false;
   searchTerm: string;
   user: User;

   snackbarConfig = new MatSnackBarConfig();

   constructor(
      private tourService: TourService,
      private userService: UserRequestsService,
      private userStorageService: UserStorageService,
      private router: Router,
      private userRequestsService: UserRequestsService,
      private _modalService: NgbModal,
      private snackbar: MatSnackBar
   ) {
      this.isLoading = true;
   }

   ngOnInit(): void {
      this.isLoading = true;
      this.userRequestsService
         .getLoggedInUser()
         .pipe(
            tap((user) => {
               this.user = user;
            })
         )
         .subscribe((data) => {
            this.likedTours = data.likedTours;
            this.isLoading = false;
         });
   }

   goToTourOverview(tourId: string | undefined): void {
      this.router.navigate([`/tour-detail-view/${tourId}`]);
   }

   unlikeTour(tourId: string | undefined): void {
      this.tourService.unlikeTour(tourId).subscribe(
         (data) => {
            // Delete tour from UI => filter tour by id
            this.likedTours = this.likedTours?.filter((tours) => tours._id !== tourId);
         },
         (error) => {
            console.log(error);
         }
      );
      this.snackbarConfig.panelClass = ['snackbar-success'];
      this.snackbarConfig.duration = 3000;
      let snackBarRef = this.snackbar.open('Tour successfully unliked', 'Undo', this.snackbarConfig);
      snackBarRef.onAction().subscribe(() => {
         this.likeTourAgain(tourId);
      });
   }

   likeTourAgain(tourId: string | undefined): void {
      this.tourService.likeTour(tourId).subscribe(
         (data) => {
            this.tourService.getTourByID(tourId!).subscribe(
               (data) => {
                  this.likedTours?.push(data);
                  this.snackbar.open('Tour liked again', undefined, this.snackbarConfig);
                  this.unlikeBtn = false;
               },
               (error) => {
                  console.log(error);
               }
            );
         },
         (error) => {
            console.log(error);
         }
      );
   }

   sortBy(indicator: string): void {
      switch (indicator) {
         case 'creationDate':
            this.likedTours?.sort(function (a, b) {
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
            this.likedTours?.sort(function (a, b) {
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
            this.likedTours?.sort(function (a, b) {
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
            this.likedTours?.sort(function (a, b) {
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
