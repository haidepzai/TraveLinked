import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';
import { User } from 'src/app/models/user.model';
import { AuthenticationStorageService } from './authentication/authentication-storage.service';

@Injectable({ providedIn: 'root' })
export class UserRequestsService {
   constructor(private http: HttpClient, private authStorage: AuthenticationStorageService) {}

   getLoggedInUser(): Observable<any> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);

      return this.http.get(ApiURLStore.GET_CURRENT_USER_DATA, {
         headers,
      });
   }

   updateUserProfile(body: any): Observable<any> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.post(ApiURLStore.UPDATE_USER_DATA, body, {
         headers,
      });
   }

   passwordChange(body: any): Observable<any> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.post(ApiURLStore.UPDATE_USER_PASSWORD, body, {
         headers,
      });
   }

   deleteUserProfile(body: any): Observable<any> {
      const options = {
         headers: this.authStorage
            .getRequestHeader()
            .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`),
         body,
      };
      return this.http.delete(ApiURLStore.DELETE_USER_PROFILE, options);
   }

   getUserById(userID: string): Observable<User> {
      const headers = new HttpHeaders({
         'Content-Type': 'application/json',
      });
      return this.http.get<User>(`${ApiURLStore.GET_USER_BY_ID}/${userID}`, {
         headers,
      });
   }

   followUser(userID: string): Observable<any> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.put<any>(`${ApiURLStore.FOLLOW_USER}/${userID}`, {}, { headers });
   }

   unfollowUser(userID: string): Observable<any> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.put<any>(`${ApiURLStore.UNFOLLOW_USER}/${userID}`, {}, { headers });
   }

   getTopUsers(): Observable<User[]> {
      const headers = new HttpHeaders({
         'Content-Type': 'application/json',
      });
      return this.http.get<User[]>(`${ApiURLStore.GET_TOP_USERS}`, {
         headers,
      });
   }

   getLocalGuides(lng: number, lat: number): Observable<User[]> {
      const headers = new HttpHeaders({
         'Content-Type': 'application/json',
      });
      const body = {
         lng,
         lat,
      };
      return this.http.post<User[]>(ApiURLStore.GET_LOCAL_GUIDES, body, {
         headers,
      });
   }
}
