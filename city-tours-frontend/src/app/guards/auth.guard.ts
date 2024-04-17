import { Observable } from 'rxjs';
import { UserStorageService } from './../services/user/user-storage.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
   constructor(public userStorageService: UserStorageService, public router: Router) {}

   canActivate(): Observable<boolean> | boolean {
      if (!this.userStorageService.$loggedIn) {
         this.router.navigate(['/not-authorized']);
         return false;
      }
      return true;
   }
}
