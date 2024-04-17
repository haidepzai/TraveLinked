import { GoogleService } from './../../services/requestServices/google.service';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/requestServices/data.service';
import { User } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-local-guides-view',
   templateUrl: './local-guides-view.component.html',
   styleUrls: ['./local-guides-view.component.css'],
})
export class LocalGuidesViewComponent implements OnInit {
   locationName: string = '';
   localGuides: User[];

   isLoading: boolean = false;

   constructor(private ds: DataService, private router: Router, private gs: GoogleService) {
      this.ds.getLoadingStatus().subscribe((status) => (this.isLoading = status));
      this.isLoading = true;
   }

   ngOnInit(): void {
      this.ds.getLocalGuides().subscribe((users: User[]) => {
         this.localGuides = users;
         this.isLoading = false;
         this.ds.setLoadingStatus(this.isLoading);
      });
      this.gs.getLocationName().subscribe((name) => {
         this.locationName = name;
      });
   }

   goToUserProfile(userID: string): void {
      this.router.navigate([`/profile-view/${userID}`]);
   }

   getUsersProfilePicture(imgUrl: string | undefined): string {
      return `${ApiURLStore.GET_IMG}/${imgUrl}`;
   }
}
