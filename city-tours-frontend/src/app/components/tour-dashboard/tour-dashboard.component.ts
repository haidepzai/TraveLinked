import { Component, OnInit } from '@angular/core';
import { UserStorageService } from 'src/app/services/user/user-storage.service';

@Component({
   selector: 'app-tour-dashboard',
   templateUrl: './tour-dashboard.component.html',
   styleUrls: ['./tour-dashboard.component.css'],
})
export class TourDashboardComponent implements OnInit {
   dashboardView: number = 1;

   constructor(public userStorageService: UserStorageService) {}

   ngOnInit(): void {}
}
