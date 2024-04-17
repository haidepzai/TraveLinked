import { WeatherService } from './../../services/requestServices/weather.service';
import { GoogleService } from 'src/app/services/requestServices/google.service';
import { DataService } from 'src/app/services/requestServices/data.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { switchMap, map, tap, mergeMap, concatMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { PointOfInterest, GoogleResponse } from 'src/app/models/poi.model';
import { WeatherModel } from 'src/app/models/weather.model';
import { ImageHelperService } from 'src/app/services/image-helper.service';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';

@Component({
   selector: 'app-sightseeing-view',
   templateUrl: './sightseeing-view.component.html',
   styleUrls: ['./sightseeing-view.component.css'],
})
export class SightseeingViewComponent implements OnInit {
   @Input() listOfPoi: PointOfInterest[];
   @Input() nextPageToken: string | undefined;
   @Input() listOfOwnPoi: PointOfInterest[];
   @Input() latitude: number;
   @Input() longitude: number;
   @Output() pointOfInterest = new EventEmitter<PointOfInterest>();

   isLoading: boolean = false;
   locationName: string = '';
   secretPoiView: boolean = false;

   weatherInfo: WeatherModel;
   iconCode: string;

   constructor(private ds: DataService, private gs: GoogleService, private ws: WeatherService) {
      this.ds.getLoadingStatus().subscribe((status) => (this.isLoading = status));
      this.isLoading = true;
   }

   ngOnInit(): void {
      if (this.listOfOwnPoi !== null && this.listOfOwnPoi !== undefined) {
      }
      // this.ds.getLocations().subscribe(data => this.listOfPoi = data);
      this.prepareData();
      this.googleImgToPoi();
   }

   onAdd(poi: PointOfInterest): void {
      this.pointOfInterest.emit(poi);
   }

   showMore(): void {
      this.isLoading = true;
      this.gs.getMorePois(this.locationName, this.nextPageToken).subscribe((data: GoogleResponse) => {
         data.results.forEach((poi) => {
            this.listOfPoi.push(poi);
         });
         this.googleImgToPoi();
         this.nextPageToken = undefined;
      });
   }

   prepareData(): void {
      // Get Location Name and its Geo-Coordinates and finally retrieve the Weather Info
      this.gs
         .getLocationName()
         .pipe(
            tap((loc) => {
               this.locationName = loc;
            }),
            concatMap((data) => {
               return this.ws.getWeatherByCoordinates(this.latitude, this.longitude);
            })
         )
         .subscribe((data: WeatherModel) => {
            this.weatherInfo = data;
            this.iconCode = data.weather[0].icon;
         });
   }

   googleImgToPoi(): void {
      // Retrieve the images for the POIs
      const tmpPoi = this.listOfPoi === undefined ? this.ds.getLocations() : of(this.listOfPoi);

      tmpPoi
         .pipe(
            tap(() => (this.isLoading = true)),
            switchMap((locations) =>
               forkJoin(
                  locations.map((loc) => (loc.photos ? this.gs.getImage(loc.photos[0].photo_reference) : of('')))
               ).pipe(map((imagePaths) => imagePaths.map((imagePath, i) => ({ ...locations[i], imagePath }))))
            )
         )
         .subscribe((locations) => {
            this.listOfPoi = locations;
            this.isLoading = false;
            this.ds.setLoadingStatus(this.isLoading);
         });
   }

   getImageOfPoi(src: string) {
      return `${ApiURLStore.GET_IMG}/${src}`;
   }
}
