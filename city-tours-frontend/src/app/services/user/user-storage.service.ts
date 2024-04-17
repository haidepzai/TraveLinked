import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root',
})
export class UserStorageService {
   private email: string | undefined;
   private role: string | undefined;
   private userName: string | undefined;
   private loggedIn = false; // Can be set to true for testing purposes
   private userId: string | undefined;

   /**
    * Getter $expireTime
    * @return {number }
    */
   public get $expireTime(): number | undefined {
      return this.expireTime;
   }

   /**
    * Setter $expireTime
    * @param {number } value
    */
   public set $expireTime(value: number | undefined) {
      this.expireTime = value;
   }
   private expireTime: number | undefined;

   /**
    * Getter $role
    * @return {string}
    */
   public get $role(): string | undefined {
      return this.role;
   }
   /**
    * Setter $role
    * @param {string} value
    */
   public set $role(value: string | undefined) {
      this.role = value;
   }

   public get $userID(): string | undefined {
      return this.userId;
   }

   public set $userID(userID: string | undefined) {
      this.userId = userID;
   }

   /**
    * Getter $loggedIn
    * @return {boolean }
    */
   public get $loggedIn(): boolean {
      return this.loggedIn;
   }
   /**
    * Setter $loggedIn
    * @param {boolean } value
    */
   public set $loggedIn(value: boolean) {
      this.loggedIn = value;
   }

   /**
    * Getter $email
    * @return {string}
    */
   public get $email(): string | undefined {
      return this.email;
   }

   /**
    * Setter $email
    * @param {string} value
    */
   public set $email(value: string | undefined) {
      this.email = value;
   }

   /**
    * Getter $userName
    * @return {string}
    */
   public get $userName(): string | undefined {
      return this.userName;
   }

   /**
    * Setter $userName
    * @param {string} value
    */
   public set $userName(value: string | undefined) {
      this.userName = value;
   }

   deleteUserStorage() {
      this.$email = undefined;
      this.$userName = undefined;
      this.$loggedIn = false;
      this.$role = undefined;
      this.$userID = undefined;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
   }
   constructor() {}
}
