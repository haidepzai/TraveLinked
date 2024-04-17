import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';
import { UserSignIn } from 'src/app/models/user-sign-in.model';
import { Observable } from 'rxjs';
import { AuthenticationStorageService } from './authentication-storage.service';
import { tap } from 'rxjs/operators';

@Injectable({
   providedIn: 'root',
})
export class AuthenticationService {
   constructor(private http: HttpClient, private authStorage: AuthenticationStorageService) {}

   handleError(error: any) {
      console.log('handle');
      alert(error.status + ' : ' + error.error);
   }

   // TODO: base64 encode body
   register(data: UserSignIn): Observable<any> {
      const body = JSON.stringify(data);
      const headers = this.authStorage.getRequestHeader();
      return this.http.post<UserSignIn>(ApiURLStore.REGISTER_URL, body, {
         headers,
      });
   }

   forgotPassword(email: string): Observable<any> {
      const body = {
         email,
      };
      const headers = this.authStorage.getRequestHeader();
      return this.http.post<any>(ApiURLStore.FORGOT_PASSWORD_URL, body, {
         headers,
      });
   }

   resetPassword(newPassword: string, resetPasswordCode: string): Observable<any> {
      const body = {
         newPassword,
         resetPasswordCode,
      };
      const headers = this.authStorage.getRequestHeader();
      return this.http.post<any>(ApiURLStore.RESET_PASSWORD_URL, body, {
         headers,
      });
   }

   signIn(user: UserSignIn): Observable<any> {
      const decodedUserLogin = btoa(`${user.email}:${user.password}`);
      const body = {
         userCredentials: decodedUserLogin,
      };
      const headers = this.authStorage.getRequestHeader();
      return this.http.post<UserSignIn>(ApiURLStore.LOGIN_URL, body, {
         headers,
      });
   }

   /**
    * Logut the user (deletes the refresh token of the user that is stored in the backend)
    */
   logOut(): Observable<any> {
      const headers = this.authStorage.getRequestHeader();
      const body = {
         refreshToken: this.authStorage.getRefreshToken(),
      };
      const options = { headers, body };
      return this.http.delete<any>(ApiURLStore.LOGOUT_URL, options);
   }

   /**
    * Refreshes the token when the access token is not valid anymore, stores the new token in a storage service
    */
   refreshToken(): Observable<any> {
      const headers = this.authStorage.getRequestHeader();
      const body = {
         refreshToken: this.authStorage.getRefreshToken(),
      };
      return this.http
         .post<any>(ApiURLStore.REFRESH_TOKEN_URL, body, { headers })
         .pipe(tap((newAccessToken) => this.authStorage.storeToken(newAccessToken)));
   }

   verifyUser(code: string): Observable<any> {
      return this.http.get<any>(ApiURLStore.CONFIRMATION_URL + code);
   }
}
