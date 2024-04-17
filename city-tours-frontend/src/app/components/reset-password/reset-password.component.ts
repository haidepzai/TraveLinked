import { SignInComponent } from './../sign-in/sign-in.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from './../../services/snack-bar.service';
import { AuthenticationService } from 'src/app/services/requestServices/authentication/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-reset-password',
   templateUrl: './reset-password.component.html',
   styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
   resetPasswordForm: FormGroup;
   isLoading: boolean = false;
   isInvalid: boolean = false;
   message: string | undefined;
   resetPasswordCode: string;
   dialogRef: MatDialogRef<SignInComponent, any> | null;

   newPasswordIsSet: boolean = false;

   constructor(
      private authenticationService: AuthenticationService,
      private snackBar: SnackBarService,
      private route: ActivatedRoute,
      private dialog: MatDialog
   ) {
      this.route.params.subscribe((params) => {
         this.resetPasswordCode = params.resetpasswordcode;
      });
   }

   ngOnInit(): void {
      this.resetPasswordForm = new FormGroup({
         password: new FormControl(null, [
            Validators.required,
            Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})'),
         ]),
         confirmPassword: new FormControl(null, Validators.required),
      });
   }

   onSubmit(): void {
      if (this.resetPasswordForm.controls.password.value !== this.resetPasswordForm.controls.confirmPassword.value) {
         this.message = 'Passwords do not match!';
         this.isInvalid = true;
         return;
      }
      this.isLoading = true;
      this.authenticationService
         .resetPassword(this.resetPasswordForm.get('password')?.value, this.resetPasswordCode)
         .subscribe(
            (data) => {
               this.isLoading = false;
               this.snackBar.showSnackBar(
                  'You have successfully set a new password! Please login!',
                  3000,
                  'snackbar-success'
               );
               this.message = data.successMessage;
               this.newPasswordIsSet = true;
            },
            (error) => {
               this.message = error.error.errorMessage;
               this.snackBar.showSnackBar(error.error.errorMessage, 3000, 'snackbar-error');
               this.isInvalid = true;
               this.isLoading = false;
            },
            () => {
               // this.dialogRef.close();
               this.isLoading = false;
            }
         );
      this.resetPasswordForm.reset();
   }

   openDialog(): void {
      if (this.dialogRef) {
         return;
      }
      this.dialogRef = this.dialog.open(SignInComponent, {
         panelClass: 'loginDialog',
         backdropClass: 'backdropBackground',
      });

      this.dialogRef.afterClosed().subscribe((result) => {
         console.log(`Dialog result: ${result}`);
         this.dialogRef = null;
      });
   }
}
