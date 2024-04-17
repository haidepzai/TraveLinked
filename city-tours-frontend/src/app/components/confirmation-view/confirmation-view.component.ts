import { DataService } from 'src/app/services/requestServices/data.service';
import { AuthenticationStorageService } from 'src/app/services/requestServices/authentication/authentication-storage.service';
import { AuthenticationService } from 'src/app/services/requestServices/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
   selector: 'app-confirmation-view',
   templateUrl: './confirmation-view.component.html',
   styleUrls: ['./confirmation-view.component.css'],
})
export class ConfirmationViewComponent implements OnInit {
   confirmationCode: string;
   isAlreadyActivated: boolean = false;
   isError: boolean = true;

   constructor(
      private route: ActivatedRoute,
      private authService: AuthenticationService,
      private authStorage: AuthenticationStorageService,
      private dataService: DataService
   ) {
      this.route.params.subscribe((params) => {
         this.confirmationCode = params.confirmationcode;
      });
   }

   ngOnInit(): void {
      this.authService.verifyUser(this.confirmationCode).subscribe(
         (data) => {
            this.authStorage.storeToken(data.accessToken, data.refreshToken);
            this.dataService.updateUserStorageOnLogin(data.accessToken);
            this.isError = false;
         },
         (error) => {
            if (error.status === 400) {
               this.isAlreadyActivated = true;
               this.isError = true;
            }
         }
      );
   }
}
