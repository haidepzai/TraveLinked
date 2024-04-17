import { ApiURLStore } from './../../../models/ApiURLs/ApiURLStore';
import { UserRequestsService } from './../../../services/requestServices/user-requests.service';
import { User } from './../../../models/user.model';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-top-travelers',
   templateUrl: './top-travelers.component.html',
   styleUrls: ['./top-travelers.component.css'],
})
export class TopTravelersComponent implements OnInit {
   isLoading = false;
   topUsers: User[] = [];

   constructor(private router: Router, private userService: UserRequestsService) {}

   ngOnInit(): void {
      this.isLoading = true;
      this.userService.getTopUsers().subscribe(
         (users) => {
            this.topUsers = users;
            this.isLoading = false;
         },
         (error) => {
            console.log(error);
         }
      );
   }

   goToUserProfile(userID: string): void {
      this.router.navigate([`/profile-view/${userID}`]);
   }

   getUsersProfilePicture(imgUrl: string | undefined): string {
      return `${ApiURLStore.GET_IMG}/${imgUrl}`;
   }
}
