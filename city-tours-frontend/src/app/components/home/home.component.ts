import { PointOfInterest } from '../../models/poi.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
   selector: 'app-home',
   templateUrl: './home.component.html',
   styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
   @Output() poiList = new EventEmitter<PointOfInterest[]>();

   constructor() {}

   ngOnInit(): void {}

   loadPoiList(pois: PointOfInterest[]): void {}
}
