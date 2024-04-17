import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { AuthenticationStorageService } from './authentication-storage.service';
import { Router } from '@angular/router';
import { UserStorageService } from '../../user/user-storage.service';
import { AuthenticationService } from './authentication.service';
import { SnackBarService } from '../../snack-bar.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
   isRefreshingToken: boolean = false;
   tokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
   constructor(
      private snackbar: SnackBarService,
      private router: Router,
      private auth: AuthenticationService,
      private authStorage: AuthenticationStorageService,
      private userStorageService: UserStorageService
   ) {}

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
         catchError((err) => {
            if (err.status === 401 && err.error.errorMessage === 'Token has been expired') {
               // Handle 401 (refresh)
               return this.handleRefresh(req, next);
            } else {
               return throwError(err);
            }
         })
      );
   }
   handleRefresh(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
      if (!this.isRefreshingToken) {
         this.isRefreshingToken = true;
         this.tokenSubject.next(null);
         return this.auth.refreshToken().pipe(
            switchMap((newTokens: any) => {
               if (newTokens.accessToken) {
                  this.tokenSubject.next(newTokens.accessToken);
                  this.authStorage.storeToken(newTokens.accessToken, newTokens.updatedRefreshToken);
                  return next.handle(this.addToken(req, newTokens));
               }
               this.userStorageService.deleteUserStorage();
               this.router.navigate(['/']);
               return throwError('No token found');
            }),
            catchError((error) => {
               this.userStorageService.deleteUserStorage();
               this.router.navigate(['/']);
               this.snackbar.showSnackBar('Session has been expired, please login again', 5000, 'snackbar-error');
               return throwError(error);
            }),
            finalize(() => {
               this.isRefreshingToken = false;
            })
         );
      } else {
         return this.tokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
               return next.handle(this.addToken(req, token));
            })
         );
      }
   }

   addToken(req: HttpRequest<any>, newToken: any): HttpRequest<any> {
      let header = new HttpHeaders();
      if (req.url.endsWith('uploadFile')) {
         //TODO: Alle Requests die nicht content type json haben beachten
         header = new HttpHeaders({ Authorization: `Bearer ${newToken.accessToken}` });
      } else {
         header = new HttpHeaders({
            Authorization: `Bearer ${newToken.accessToken}`,
            'Content-Type': 'application/json',
         });
      }
      return req.clone({ headers: header });
   }
}
