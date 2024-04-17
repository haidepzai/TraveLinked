import { SnackBarService } from './../../services/snack-bar.service';
import { DataService } from './../../services/requestServices/data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/requestServices/authentication/authentication.service';
import { AuthenticationStorageService } from 'src/app/services/requestServices/authentication/authentication-storage.service';
import { Router } from '@angular/router';

@Component({
   selector: 'app-sign-in',
   templateUrl: './sign-in.component.html',
   styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
   message: string | undefined;
   currentForm = 'Login';
   isInvalid: boolean = true;
   loginForm: FormGroup;
   registerForm: FormGroup;
   forgotPasswordForm: FormGroup;
   isLoading: boolean = false;

   constructor(
      private formBuilder: FormBuilder,
      private authenticationService: AuthenticationService,
      private dialogRef: MatDialogRef<SignInComponent>,
      private snackBar: SnackBarService,
      private authStorage: AuthenticationStorageService,
      private dataService: DataService,
      private route: Router
   ) {}

   ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
         email: this.formBuilder.control(null, [
            Validators.pattern('[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*'),
            Validators.email,
            Validators.required,
         ]),
         password: [null, Validators.required],
      });

      this.registerForm = new FormGroup({
         fullName: new FormControl(null, [Validators.required]),
         email: new FormControl(null, [
            Validators.pattern('[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*'),
            Validators.email,
            Validators.required,
         ]),
         password: new FormControl(null, [
            Validators.required,
            Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})'),
         ]),
         confirmPassword: new FormControl(null, Validators.required),
      });

      this.forgotPasswordForm = new FormGroup({
         email: new FormControl(null, [
            Validators.pattern('[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*'),
            Validators.email,
            Validators.required,
         ]),
      });
   }
   onSubmit(): void {
      if (this.route.url === '/not-authorized') {
         this.route.navigate(['/']);
      }

      if (this.currentForm === 'Login') {
         this.isLoading = true;
         this.authenticationService.signIn(this.loginForm.value).subscribe(
            (data) => {
               this.authStorage.storeToken(data.accessToken, data.refreshToken);
               this.dataService.updateUserStorageOnLogin(data.accessToken);
               this.snackBar.showSnackBar('You are now logged in', 3000, 'snackbar-success');
               window.location.reload();
            },
            (error) => {
               this.message = error.error.errorMessage;
               this.isInvalid = true;
               this.snackBar.showSnackBar(error.error.errorMessage, 3000, 'snackbar-error');
               this.isLoading = false;
            },
            () => {
               this.dialogRef.close();
               this.isLoading = false;
            }
         );
         this.loginForm.reset();
      } else if (this.currentForm === 'Register') {
         if (this.registerForm.controls.password.value !== this.registerForm.controls.confirmPassword.value) {
            this.message = 'Passwords do not match!';
            this.isInvalid = true;
            return;
         }
         this.isLoading = true;
         this.authenticationService.register(this.registerForm.value).subscribe(
            (data) => {
               this.isLoading = false;
               this.snackBar.showSnackBar(
                  'You have successfully registered, please confirm your mail!',
                  3000,
                  'snackbar-success'
               );
               this.message = data.successMessage;
               this.authStorage.storeToken(data.accessToken, data.refreshToken);
               this.isInvalid = false;
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
         this.registerForm.reset();
      } else if (this.currentForm === 'ForgotPassword') {
         this.isLoading = true;
         this.authenticationService.forgotPassword(this.forgotPasswordForm.get('email')?.value).subscribe(
            (data) => {
               this.isLoading = false;
               this.snackBar.showSnackBar(
                  'We have sent you a mail with a link to reset your password!',
                  3000,
                  'snackbar-success'
               );
               this.message = data.successMessage;
               this.isInvalid = false;
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
      }
   }

   changeForm(currentForm: string): void {
      this.currentForm = currentForm;
      this.message = undefined;
   }
}
