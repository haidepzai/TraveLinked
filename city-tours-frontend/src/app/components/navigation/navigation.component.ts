import { SnackBarService } from './../../services/snack-bar.service';
import { SignInComponent } from './../sign-in/sign-in.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HostListener } from '@angular/core';
import { UserStorageService } from 'src/app/services/user/user-storage.service';
import { AuthenticationService } from 'src/app/services/requestServices/authentication/authentication.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
   selector: 'app-navigation',
   templateUrl: './navigation.component.html',
   styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
   isScrolled = false;
   dialogRef: MatDialogRef<SignInComponent, any> | null;

   constructor(
      private snackBar: SnackBarService,
      private dialog: MatDialog,
      public userStorageService: UserStorageService,
      private authenticationService: AuthenticationService,
      private router: Router,
      public translate: TranslateService
   ) {
      translate.addLangs(['en', 'de']);
      translate.setDefaultLang('en');

      const browserLang = translate.getBrowserLang();
      translate.use(browserLang.match(/en|de/) ? browserLang : 'en');
   }

   ngOnInit(): void {}

   logout() {
      this.authenticationService.logOut().subscribe(
         (data) => {
            this.userStorageService.deleteUserStorage();
            this.snackBar.showSnackBar('You have successfully logged out', 3000, 'snackbar-success');
            this.router.navigate(['/']);
         },
         (error) => {
            console.log(error);
            this.snackBar.showSnackBar(error.error.errorMessage, 3000, 'snackbar-error');
            console.log(error.errorMessage); // TODO: snackbar
         }
      );
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

   openDialogIfNotLoggedIn() {
      if (!this.userStorageService.$loggedIn) {
         this.openDialog();
      }
   }

   @HostListener('window:scroll')
   scrollEvent(): void {
      window.pageYOffset >= 120 ? (this.isScrolled = true) : (this.isScrolled = false);
   }

   goToProfile(): void {
      if (this.userStorageService.$loggedIn) {
         this.router.navigate([`/profile-view/${this.userStorageService.$userID}`]);
      }
   }
}
