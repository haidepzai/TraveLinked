import { MessageComponent } from './../message/message.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from './../../services/snack-bar.service';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';
import { UserStorageService } from './../../services/user/user-storage.service';
import { TourService } from 'src/app/services/requestServices/tour.service';
import { Tour } from './../../models/tour.model';
import { UserRequestsService } from './../../services/requestServices/user-requests.service';
import { mergeMap, tap, concatMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
   selector: 'app-profile-view',
   templateUrl: './profile-view.component.html',
   styleUrls: ['./profile-view.component.css'],
})
export class ProfileViewComponent implements OnInit {
   user: User;
   tours: Tour[];
   pictureURL: string;
   hometown: string;
   isLoading: boolean = false;
   isOwnProfile: boolean = false;
   hasFollowed: boolean = false;
   isLoggedIn: boolean = false;

   followers: number = 0;
   following: number = 0;

   messageDialogRef: MatDialogRef<MessageComponent, any> | null;

   constructor(
      private route: ActivatedRoute,
      private userService: UserRequestsService,
      private tourService: TourService,
      private router: Router,
      private userStorageService: UserStorageService,
      private snackBar: SnackBarService,
      private dialog: MatDialog
   ) {}

   ngOnInit(): void {
      this.isLoggedIn = this.userStorageService.$loggedIn;
      this.isLoading = true;
      this.route.params
         .pipe(
            mergeMap((params) => {
               return this.userService.getUserById(params.userid);
            }),
            tap((user: User) => {
               this.user = user;
            }),
            concatMap((data) => {
               return this.tourService.getToursByUserID(data._id);
            })
         )
         .subscribe(
            (data) => {
               this.tours = data;
               this.hometown = this.user.hometown ?? 'Hometown not set';
               const url = this.user.profilePicture?.imageURL;
               this.pictureURL = `${ApiURLStore.GET_IMG}/${url}`;
               this.checkOwnProfile();
               this.followers = this.user.followers?.length ?? 0;
               this.following = this.user.following?.length ?? 0;
               this.isLoading = false;
            },
            (err) => {
               this.pictureURL = `${ApiURLStore.GET_IMG}/missingProfilePicture.png`;
               console.log(err.errorMessage);
               this.isLoading = false;
            }
         );
   }

   goToTourOverview(tourId: string | undefined): void {
      console.log(tourId);
      this.router.navigate([`/tour-detail-view/${tourId}`]);
   }

   goToEditProfile(): void {
      this.router.navigate(['/edit-profile']);
   }

   checkOwnProfile(): void {
      if (this.userStorageService.$userID === this.user._id) {
         this.isOwnProfile = true;
      } else {
         this.isOwnProfile = false;
         if (this.userStorageService.$userID !== undefined || this.userStorageService.$userID !== '') {
            this.checkHasFollowed();
         } else {
            this.hasFollowed = false;
         }
      }
   }

   checkHasFollowed(): void {
      if (this.user.followers?.includes(this.userStorageService.$userID!)) {
         this.hasFollowed = true;
      } else {
         this.hasFollowed = false;
      }
   }

   onFollow(): void {
      if (!this.userStorageService.$loggedIn) {
         this.snackBar.showSnackBar('Please login to follow!', 3000, 'snackbar-error');
         return;
      }
      if (this.hasFollowed) {
         this.userService.unfollowUser(this.user._id).subscribe(
            (data) => {
               this.snackBar.showSnackBar(data.successMessage, 3000, 'snackbar-success');
               this.followers -= 1;
            },
            (error) => {
               this.snackBar.showSnackBar(error.errorMessage, 3000, 'snackbar-error');
            }
         );
         this.hasFollowed = false;
      } else {
         this.userService.followUser(this.user._id).subscribe(
            (data) => {
               this.snackBar.showSnackBar(data.successMessage, 3000, 'snackbar-success');
               this.followers += 1;
            },
            (error) => {
               this.snackBar.showSnackBar(error.errorMessage, 3000, 'snackbar-error');
            }
         );
         this.hasFollowed = true;
      }
   }

   getPictureOfSight(src: string | undefined) {
      return src ? `${ApiURLStore.GET_IMG}/${src}` : `${ApiURLStore.GET_IMG}/defaultImage.png`;
   }

   openMessageDialog(): void {
      this.messageDialogRef = this.dialog.open(MessageComponent, {
         backdropClass: 'backdropBackground',
         data: { user: this.user },
      });

      this.messageDialogRef.afterClosed().subscribe((result) => {
         console.log(`Dialog result: ${result}`);
         this.messageDialogRef = null;
      });
   }
}
