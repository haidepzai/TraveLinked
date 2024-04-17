import { SnackBarService } from '../../../../services/snack-bar.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';
import { GoogleService } from 'src/app/services/requestServices/google.service';
import { ImageService } from 'src/app/services/requestServices/image.service';
import { UserRequestsService } from 'src/app/services/requestServices/user-requests.service';
import { UserStorageService } from 'src/app/services/user/user-storage.service';
import { DeleteProfileDialogComponent } from '../delete-profile-dialog/delete-profile-dialog.component';
import { Router } from '@angular/router';

@Component({
   selector: 'app-edit-profile-view',
   templateUrl: './edit-profile-view.component.html',
   styleUrls: ['./edit-profile-view.component.css'],
})
export class EditProfileViewComponent implements OnInit {
   @ViewChild('searchBar') homtownInputView: ElementRef;
   @ViewChild('togglePublic') publicToggle: MatSlideToggle;

   constructor(
      private router: Router,
      private matDialog: MatDialog,
      private imgUplaodService: ImageService,
      private formBuilder: FormBuilder,
      private snackBar: SnackBarService,
      private googleService: GoogleService,
      public userStorageService: UserStorageService,
      private userRequests: UserRequestsService
   ) {}

   isLoadingResults: boolean;

   pictureURL: string;
   localChangeStorage: Map<string, any> = new Map<string, any>();
   hometown: string;
   lng: number;
   lat: number;

   isLocalGuide: boolean = false;
   imgForm: FormGroup;
   passwordForm: FormGroup;

   ngOnInit(): void {
      this.userRequests.getLoggedInUser().subscribe(
         (res) => {
            console.log(res);
            this.hometown = res.hometown ?? 'Hometown not set';
            this.lng = res.location?.coordinates[0] ?? null;
            this.lat = res.location?.coordinates[1] ?? null;
            const url = res.profilePicture.imageURL;
            this.pictureURL = `${ApiURLStore.GET_IMG}/${url}`;
            this.isLocalGuide = res.isLocalGuide;
            if (res.profileIsPublic) {
               this.publicToggle.toggle();
            }
         },
         (err) => {
            this.pictureURL = `${ApiURLStore.GET_IMG}/missingProfilePicture.png`;
            console.log(err.errorMessage);
         }
      );
      this.imgForm = this.formBuilder.group({
         imageFile: [null, [Validators.required]],
      });

      this.passwordForm = this.formBuilder.group({
         passwordNew: new FormControl(null, [
            Validators.required,
            Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})'),
         ]),
         confirmPassword: new FormControl(null, [
            Validators.required,
            Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})'),
         ]),
         oldPassword: new FormControl(null, Validators.required),
      });
   }

   searchLocation(location: string) {
      this.googleService.getLocationInfo(location).subscribe(
         (data) => {
            if (data.status === 'OK') {
               const townData = data.results[0];
               const lat = townData.geometry.location.lat;
               const lng = townData.geometry.location.lng;
               this.localChangeStorage.set('hometown', townData.name);
               this.localChangeStorage.set('location', [lng, lat]);
            }
         },
         (err) => {
            console.log(err);
         }
      );
   }

   saveProfileChanges() {
      const body = this.buildBodyForCommit();
      this.userRequests.updateUserProfile(body).subscribe(
         (data) => {
            this.snackBar.showSnackBar('Successfully saved user settings', 3000, 'snackbar-success');
         },
         (err) => {
            this.snackBar.showSnackBar(err.errorMessage, 3000, 'snackbar-error');
            console.log(err.errorMessage);
         }
      );
   }

   private buildBodyForCommit(): string {
      const body: any = {};
      console.log(this.localChangeStorage.values());
      this.localChangeStorage.forEach((value: any, key: string) => {
         body[key] = value;
      });
      return JSON.stringify(body);
   }

   imgSubmit() {
      this.isLoadingResults = true;
      if (!this.imgForm.get('imageFile')!.value._files[0].type.startsWith('image')) {
         this.snackBar.showSnackBar('Document type not allowed', 5000, 'snackbar-error');
         return;
      }
      this.imgUplaodService
         .uploadImg(this.imgForm.value, (this.imgForm.get('imageFile') as AbstractControl).value._files[0], 'user')
         .subscribe(
            (res: any) => {
               this.isLoadingResults = false;
               if (res) {
                  console.log(res);
                  this.pictureURL = `${ApiURLStore.GET_IMG}/${res.fileName}`;
                  this.snackBar.showSnackBar('Successfully uploaded new profile picture', 3000, 'snackbar-success');
               }
            },
            (err: any) => {
               console.log(err);
               this.isLoadingResults = false;
            }
         );
   }

   submitPasswordChange() {
      if (this.passwordForm.controls.confirmPassword.value !== this.passwordForm.controls.passwordNew.value) {
         this.snackBar.showSnackBar('Passwords do not match', 3000, 'snackbar-error');
         return;
      }
      const body = {
         oldPassword: this.passwordForm.controls.oldPassword.value,
         newPassword: this.passwordForm.controls.passwordNew.value,
      };
      this.userRequests.passwordChange(body).subscribe(
         (data) => {
            console.log(data);
            if (data) {
               this.snackBar.showSnackBar('Successfully updated Password', 3000, 'snackbar-success');
            }
         },
         (err) => {
            if (err.status === 401) {
               this.snackBar.showSnackBar(err.error.errorMessage, 3000, 'snackbar-error');
            }
         }
      );
   }

   openDeleteDialog() {
      this.matDialog.open(DeleteProfileDialogComponent);
   }

   cancelEdit() {
      this.localChangeStorage.clear();
      const profileViewURL = `profile-view/${this.userStorageService.$userID}`;
      this.router.navigate([profileViewURL]);
   }
}
