import { ApiURLStore } from './../models/ApiURLs/ApiURLStore';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root',
})
export class ContactService {
   constructor(private http: HttpClient) {}

   sendContactForm(formBody: any): Observable<any> {
      const headers = new HttpHeaders({
         'Content-Type': 'application/json',
      });
      return this.http.post<any>(ApiURLStore.SEND_CONTACT_FORM, formBody, {
         headers,
      });
   }
}
