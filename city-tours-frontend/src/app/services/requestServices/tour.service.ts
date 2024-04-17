import { ToDo } from './../../models/todo.model';
import { Comments } from './../../models/comment.model';
import { Tour } from '../../models/tour.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiURLStore } from '../../models/ApiURLs/ApiURLStore';
import { Observable } from 'rxjs';
import { AuthenticationStorageService } from './authentication/authentication-storage.service';

@Injectable({
   providedIn: 'root',
})
export class TourService {
   constructor(private authStorage: AuthenticationStorageService, private http: HttpClient) {}

   addTour(tour: Tour): Observable<Tour> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      const body = {
         tour,
      };
      return this.http.post<Tour>(ApiURLStore.CREATE_TOUR, body, {
         headers,
      });
   }

   editTour(tour: Tour): Observable<Tour> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      const body = {
         tour,
      };
      return this.http.put<Tour>(ApiURLStore.EDIT_TOUR, body, {
         headers,
      });
   }

   shareTour(tourId: string | undefined): Observable<any> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);

      return this.http.put<any>(
         `${ApiURLStore.SHARE_TOUR}/${tourId}`,
         {},
         {
            headers,
         }
      );
   }

   saveComments(tourId: string, comments: Comments[]): Observable<Tour> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      const body = {
         tourId,
         comments,
      };
      return this.http.post<Tour>(ApiURLStore.SAVE_COMMENTS, body, {
         headers,
      });
   }

   likeComment(tourId: string, commentId: string): Observable<any> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      const body = {
         tourId,
         commentId,
      };
      return this.http.post<any>(ApiURLStore.LIKE_COMMENT, body, {
         headers,
      });
   }

   unlikeComment(tourId: string, commentId: string): Observable<any> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      const body = {
         tourId,
         commentId,
      };
      return this.http.post<any>(ApiURLStore.UNLIKE_COMMENT, body, {
         headers,
      });
   }

   saveTodos(tourId: string, todos: ToDo[]): Observable<Tour> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      const body = {
         tourId,
         todos,
      };
      return this.http.post<Tour>(ApiURLStore.SAVE_TODOS, body, {
         headers,
      });
   }

   getTourByID(tourId: string): Observable<Tour> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.get<Tour>(`${ApiURLStore.GET_TOUR_BY_ID}/${tourId}`, {
         headers,
      });
   }

   getOwnTours(): Observable<Tour[]> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.get<Tour[]>(ApiURLStore.GET_OWN_TOURS, { headers: headers });
   }

   deleteTour(tourId: string | undefined): Observable<any> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.delete<any>(`${ApiURLStore.DELETE_TOUR}/${tourId}`, { headers });
   }

   getTopTours(): Observable<Tour[]> {
      const headers = new HttpHeaders({
         'Content-Type': 'application/json',
      });
      return this.http.get<Tour[]>(ApiURLStore.GET_TOP_TOURS, {
         headers,
      });
   }

   likeTour(tourId: string | undefined): Observable<any> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.put<any>(`${ApiURLStore.LIKE_TOUR}/${tourId}`, {}, { headers });
   }

   unlikeTour(tourId: string | undefined): Observable<any> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.put<any>(`${ApiURLStore.UNLIKE_TOUR}/${tourId}`, {}, { headers });
   }

   getActiveTours(): Observable<Tour[]> {
      const headers = new HttpHeaders({
         'Content-Type': 'application/json',
      });
      return this.http.get<Tour[]>(ApiURLStore.GET_ACTIVE_TOURS, {
         headers,
      });
   }

   getTourByLocation(lng: number, lat: number): Observable<Tour[]> {
      const headers = new HttpHeaders({
         'Content-Type': 'application/json',
      });
      const body = {
         lng,
         lat,
      };
      return this.http.post<Tour[]>(ApiURLStore.GET_TOURS_BY_LOCATION, body, {
         headers,
      });
   }

   getToursByUserID(userID: string | undefined): Observable<Tour[]> {
      const headers = new HttpHeaders({
         'Content-Type': 'application/json',
      });
      return this.http.get<Tour[]>(`${ApiURLStore.GET_TOURS_BY_USER_ID}/${userID}`, {
         headers,
      });
   }

   getTourByPoiLocation(lng: number, lat: number): Observable<Tour[]> {
      const headers = new HttpHeaders({
         'Content-Type': 'application/json',
      });
      const body = {
         lng,
         lat,
      };
      return this.http.post<Tour[]>(ApiURLStore.GET_TOURS_BY_POI_LOCATOIN, body, {
         headers,
      });
   }
}
