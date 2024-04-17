import { Component, OnInit } from '@angular/core';
import { AuthenticationStorageService } from './services/requestServices/authentication/authentication-storage.service';
import { DataService } from './services/requestServices/data.service';
import jwt_decode from 'jwt-decode';
import { UserStorageService } from './services/user/user-storage.service';

@Component({ selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css'] })
export class AppComponent implements OnInit {
   title = 'TraveLinked';

   constructor(
      private userStorageService: UserStorageService,
      private authStorage: AuthenticationStorageService,
      private data: DataService
   ) {}

   ngOnInit(): void {
      const accessToken = this.authStorage.getAccessToken();
      const refreshToken = this.authStorage.getRefreshToken();
      if (accessToken && refreshToken && this.tokenIsValid(refreshToken)) {
         this.data.updateUserStorageOnLogin(accessToken);
      } else {
         this.userStorageService.deleteUserStorage();
      }
   }

   tokenIsValid(token: string): boolean {
      const decodedToken = jwt_decode(token) as any;
      if (!decodedToken.lastLookupTime) return false;
      const expireTime = decodedToken.lastLookupTime + 86400000;
      return expireTime - Date.now() > 1200000;
   }
}
