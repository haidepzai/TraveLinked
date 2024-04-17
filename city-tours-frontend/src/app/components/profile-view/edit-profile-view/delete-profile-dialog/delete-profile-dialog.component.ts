import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserRequestsService } from 'src/app/services/requestServices/user-requests.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserStorageService } from 'src/app/services/user/user-storage.service';

@Component({
   selector: 'app-delete-profile-dialog',
   templateUrl: './delete-profile-dialog.component.html',
   styleUrls: ['./delete-profile-dialog.component.css'],
})
export class DeleteProfileDialogComponent implements OnInit {
   constructor(
      private userRequestService: UserRequestsService,
      private router: Router,
      private userStorageService: UserStorageService,
      private snackBar: SnackBarService,
      private matDialogRef: MatDialogRef<DeleteProfileDialogComponent>
   ) {}

   passwordFormControl = new FormControl('', [Validators.required]);

   ngOnInit(): void {}

   deleteProfile(password: string) {
      const body = {
         password: password,
      };
      this.userRequestService.deleteUserProfile(body).subscribe(
         () => {
            this.snackBar.showSnackBar('Your Profile has been deleted', 5000, 'snackbar-success');
            this.userStorageService.deleteUserStorage();
            this.router.navigate(['/']);
            this.matDialogRef.close();
         },
         (err) => {
            this.snackBar.showSnackBar(err.error.errorMessage, 5000, 'snackbar-error');
         }
      );
   }
}
