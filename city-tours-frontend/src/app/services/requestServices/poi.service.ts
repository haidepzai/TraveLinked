import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiURLStore } from '../../models/ApiURLs/ApiURLStore';
import { PointOfInterest } from '../../models/poi.model';
import { AuthenticationStorageService } from './authentication/authentication-storage.service';

@Injectable({
   providedIn: 'root',
})
export class PoiService {
   constructor(private authStorage: AuthenticationStorageService, private http: HttpClient) {}

   addPoi(poi: PointOfInterest): Observable<PointOfInterest> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      const body = {
         poi,
      };
      return this.http.post<PointOfInterest>(ApiURLStore.CREATE_POI, body, {
         headers,
      });
   }

   getPois(): Observable<PointOfInterest[]> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.get<PointOfInterest[]>(ApiURLStore.GET_POIS, {
         headers,
      });
   }

   getPoisOfUser(): Observable<PointOfInterest[]> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.get<PointOfInterest[]>(ApiURLStore.GET_POIS_OF_USER, {
         headers,
      });
   }

   getPoi(poiId: string): Observable<PointOfInterest> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.get<PointOfInterest>(`${ApiURLStore.GET_POI}/${poiId}`, {
         headers,
      });
   }

   deletePoi(poiId: string | undefined): Observable<any> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.delete<any>(`${ApiURLStore.DELETE_POI}/${poiId}`, { headers });
   }

   editPoi(poi: PointOfInterest): Observable<PointOfInterest> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      const body = {
         poi,
      };
      return this.http.put<PointOfInterest>(ApiURLStore.EDIT_POI, body, {
         headers,
      });
   }
}
