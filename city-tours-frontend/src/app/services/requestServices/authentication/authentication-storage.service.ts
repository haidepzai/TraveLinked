import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root',
})
export class AuthenticationStorageService {
   private requestHeader: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
   private authenticationStorage: Map<string, any> = new Map<string, any>();

   constructor() {}

   getRequestHeader(): HttpHeaders {
      return this.requestHeader;
   }
   getStoredValue(storedValue: string): any {
      return this.authenticationStorage.get(storedValue);
   }
   storeToken(accessToken: string, refreshToken?: string): void {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
   }

   setPersistentHeader(headerType: string, headerValue: string) {
      this.requestHeader.set(headerType, headerValue);
   }

   getAccessToken(): string | null {
      return localStorage.getItem('accessToken');
   }

   getRefreshToken(): string | null {
      return localStorage.getItem('refreshToken');
   }
}
