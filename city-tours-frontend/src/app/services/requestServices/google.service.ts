import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';

import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GoogleResponse } from 'src/app/models/poi.model';

@Injectable({
   providedIn: 'root',
})
export class GoogleService {
   constructor(private http: HttpClient) {}

   locationName: string | undefined = '';
   private locationNameSource = new BehaviorSubject<any>(this.locationName);

   getLocationInfo(location: string): Observable<GoogleResponse> {
      console.log(location);
      const headers = new HttpHeaders({
         'Content-Type': 'application/json',
      });
      return this.http.post<GoogleResponse>(ApiURLStore.GET_GOOGLE_LOCATION, { name: location }, { headers });
   }

   getPois(location: string): Observable<GoogleResponse> {
      this.setLocationName(location);
      return this.http.post<GoogleResponse>(ApiURLStore.GET_GOOGLE_POIS, {
         name: location,
      });
   }

   getMorePois(location: string, pageToken: string | undefined): Observable<GoogleResponse> {
      this.setLocationName(location);
      return this.http.post<GoogleResponse>(ApiURLStore.GET_GOOGLE_MORE_POIS, {
         name: location,
         pageToken: pageToken,
      });
   }

   getImage(photoRef: string): Observable<string> {
      const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
      return this.http.get(`${ApiURLStore.GET_GOOGLE_IMAGE}?photoref=${photoRef}`, {
         headers,
         responseType: 'text',
      });
   }

   getNearbyPois(lat: number, lng: number): Observable<GoogleResponse> {
      const headers = new HttpHeaders({
         'Content-Type': 'application/json',
      });
      return this.http.post<GoogleResponse>(
         ApiURLStore.GET_GOOGLE_NEARBY_POIS,
         {
            lat,
            lng,
         },
         { headers }
      );
   }

   public getLocationName(): Observable<string> {
      return this.locationNameSource.asObservable();
   }

   public setLocationName(location: string | undefined) {
      this.locationName = location;
      return this.locationNameSource.next(this.locationName);
   }
}
