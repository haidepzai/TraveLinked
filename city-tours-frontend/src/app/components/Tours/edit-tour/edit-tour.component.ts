import { DataService } from 'src/app/services/requestServices/data.service';
import { UserStorageService } from '../../../services/user/user-storage.service';
import { ComponentCanDeactivate } from '../../../guards/tour-creation.guard';
import { Tour } from '../../../models/tour.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { map, mergeMap, tap, switchMap } from 'rxjs/operators';
import { GoogleService } from 'src/app/services/requestServices/google.service';
import { TourService } from 'src/app/services/requestServices/tour.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Geocoordinates, GoogleResponse, Locations, PointOfInterest } from 'src/app/models/poi.model';
import { PoiService } from 'src/app/services/requestServices/poi.service';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';
import { of, forkJoin } from 'rxjs';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';

@Component({
   selector: 'app-edit-tour',
   templateUrl: './edit-tour.component.html',
   styleUrls: ['./edit-tour.component.css'],
})
export class EditTourComponent implements OnInit, ComponentCanDeactivate {
   @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
   @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;
   @ViewChild('uploadImage') imageUpload: ImageUploadComponent;

   saved = false;
   tour: Tour;
   tourCreationForm: FormGroup;

   nextPageToken: string | undefined;

   // Liste für die Pois die in der Gegend sind.
   listOfPoi: PointOfInterest[] = [];

   // Liste für die Pois die andere User erstellt haben
   listOfOwnPoi: PointOfInterest[] = [];

   // Liste der Pois die zur Tour hinzugefügt wurden
   sights: PointOfInterest[] = [];

   // Aktueller Poi der auf der Map angeklickt wird
   poi: PointOfInterest;

   // Image Src für das Titelbild des Pois
   imgSrc: string;

   //Geo-coordinates for the tour
   cityName: string;

   // Einstellungen für die Maps
   zoom = 11;
   center: google.maps.LatLngLiteral = {
      lat: 52.520008,
      lng: 13.404954,
   };
   options: google.maps.MapOptions = {
      zoomControl: true,
      scrollwheel: true,
      disableDoubleClickZoom: true,
   };

   markerOptions: google.maps.MarkerOptions = {
      animation: google.maps.Animation.DROP,
   };

   ownMarkerOptions: google.maps.MarkerOptions = {
      animation: google.maps.Animation.DROP,
      icon: '../../../assets/icons/gps32px.png',
      draggable: true,
   };

   showList: boolean = false;
   isLoading: boolean = false;

   constructor(
      private googleService: GoogleService,
      private tourService: TourService,
      private snackBar: MatSnackBar,
      private router: Router,
      private poiService: PoiService,
      private userStorageService: UserStorageService,
      private route: ActivatedRoute,
      private dataService: DataService
   ) {
      this.route.params
         .pipe(
            mergeMap((params) => {
               console.log(params);
               return this.tourService.getTourByID(params.tourid);
            }),
            tap((tour: Tour) => {
               this.tour = tour;
            })
         )
         .subscribe((data: any) => {
            if (this.tour.creator !== this.userStorageService.$userID) {
               this.router.navigate(['/not-authorized']);
            }
            this.initializeForm();
            this.sights = data.sights;
            this.center.lng = data.location.coordinates[0];
            this.center.lat = data.location.coordinates[1];
            this.fetchPois(data.cityName);
         });
   }

   ngOnInit(): void {
      this.getOwnCreatedPois();
      this.googleService.getLocationName().subscribe((loc) => {
         this.cityName = loc;
      });
   }

   drop(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.sights, event.previousIndex, event.currentIndex);
   }

   openInfo(marker: MapMarker, poi: PointOfInterest) {
      this.poi = poi;
      this.imgSrc =
         this.poi.titleImage?.imageURL !== null
            ? `${ApiURLStore.GET_IMG}/${this.poi.titleImage?.imageURL}`
            : './../../../assets/images/background_1.jpg';
      this.info.open(marker);
   }

   searchLocation(location: string) {
      if (location !== null && location !== '') {
         this.googleService
            .getLocationInfo(location)
            .pipe(
               tap((res) => {
                  if (res.status === 'OK') {
                     this.center.lat = res.results[0].geometry.location.lat;
                     this.center.lng = res.results[0].geometry.location.lng;
                  }
               }),
               mergeMap((data) => {
                  if (!this.showList) {
                     this.map.panTo(this.center);
                  }
                  return this.googleService.getPois(location);
               })
            )
            .subscribe((data: GoogleResponse) => {
               if (data.status === 'OK') {
                  this.nextPageToken = data.next_page_token;
                  //this.listOfPoi = data.results;
                  this.googleImgToPoi(data.results);
               }
            });
      }
   }

   fetchPois(location: string): void {
      this.googleService.getPois(location).subscribe((data: GoogleResponse) => {
         this.nextPageToken = data.next_page_token;
         this.googleImgToPoi(data.results);
      });
   }

   addPoiToSights(poi: PointOfInterest): void {
      if (!this.sights.includes(poi)) {
         this.sights.push(poi);
         if (this.info) {
            this.info.close();
         }
         this.snackBar.open('Successfully added Point of Interest', undefined, {
            duration: 3000,
            panelClass: ['mat-toolbar', 'snackbar-success'],
         });
      }
   }

   deletePoiFromSights(poi: PointOfInterest): void {
      this.deleteItemFromArray(this.sights, poi);
   }

   changeListOrMapView(): void {
      this.showList = !this.showList;
   }

   deleteItemFromArray(array: object[], object: object): void {
      array.forEach((value, index) => {
         if (index === array.indexOf(object)) {
            array.splice(index, 1);
         }
      });
   }

   onSubmit(): void {
      if (this.sights.length > 2) {
         this.isLoading = true;
         const newTour: Tour = {
            name: this.tourCreationForm.get('name')?.value,
            description: this.tourCreationForm.get('description')?.value,
            createdAt: this.tour.createdAt,
            sights: this.sights,
            likes: this.tour.likes,
            userName: this.userStorageService.$userName,
            startDate: this.tourCreationForm.get('date.startDate')?.value,
            endDate: this.tourCreationForm.get('date.endDate')?.value,
            _id: this.tour._id,
            cityName: this.cityName,
         };
         this.tourService.editTour(newTour).subscribe(
            (data) => {
               this.saved = true;
               this.snackBar.open('Tour successfully edited!', undefined, {
                  duration: 3000,
                  panelClass: ['mat-toolbar', 'snackbar-success'],
               });
               this.resetForm(data._id);
               this.imageUpload.onFormSubmit(data._id, 'tour');
            },
            (error) => {
               console.log(error);
               this.isLoading = false;
               this.snackBar.open('There was en error!', undefined, {
                  duration: 3000,
                  panelClass: ['mat-toolbar', 'snackbar-error'],
               });
            }
         );
      } else {
         this.snackBar.open('You need to add at least 3 sights for you tour!', undefined, {
            duration: 3000,
            panelClass: ['mat-toolbar', 'snackbar-error'],
         });
      }
   }

   resetForm(tourId: string | undefined): void {
      if (tourId !== undefined && tourId !== null) {
         this.tourCreationForm.reset();
         this.sights = [];
         this.listOfPoi = [];
         this.isLoading = false;
         this.router.navigate([`/tour-detail-view/${tourId}`]);
      }
   }

   CanDeactivate() {
      return !this.saved ? confirm('Are you sure? You have not saved your tour yet!') : true;
   }

   getOwnCreatedPois(): void {
      this.poiService
         .getPois()
         .pipe(map((response) => response))
         .subscribe((data: PointOfInterest[]) => {
            this.listOfOwnPoi = data;
         });
   }

   initializeForm(): void {
      this.tourCreationForm = new FormGroup({
         name: new FormControl(this.tour.name, [Validators.required]),
         description: new FormControl(this.tour.description, [Validators.required]),
         imagePath: new FormControl(this.tour.titleImage?.imageURL ?? ''),
         date: new FormGroup({
            startDate: new FormControl(this.tour.startDate, [Validators.required]),
            endDate: new FormControl(this.tour.endDate, [Validators.required]),
         }),
      });
   }

   googleImgToPoi(pois: PointOfInterest[]): void {
      // Retrieve the images for the POIs
      of(pois)
         .pipe(
            tap(() => (this.isLoading = true)),
            switchMap((locations) =>
               forkJoin(
                  locations.map((loc) =>
                     loc.photos ? this.googleService.getImage(loc.photos[0].photo_reference) : of('')
                  )
               ).pipe(map((imagePaths) => imagePaths.map((imagePath, i) => ({ ...locations[i], imagePath }))))
            )
         )
         .subscribe((locations) => {
            this.listOfPoi = locations;
            this.isLoading = false;
            this.dataService.setLoadingStatus(this.isLoading);
         });
   }

   getNearByPois(lat: number, lng: number): void {
      if (lat !== null && lng !== null) {
         this.isLoading = true;

         this.googleService
            .getNearbyPois(lat, lng)
            .pipe(map((response) => response))
            .subscribe((data: GoogleResponse) => {
               if (data) {
                  if (data.status === 'OK') {
                     //this.listOfPoi = data.results;
                     this.googleImgToPoi(data.results);
                     this.googleService.setLocationName(data.results[0].vicinity);
                     this.isLoading = false;
                  } else if (data.status === 'ZERO_RESULTS') {
                     this.listOfPoi = [];
                     this.isLoading = false;
                  }
               } else {
                  this.listOfPoi = [];
                  this.isLoading = false;
               }
            });
      }
   }

   searchInThisArea(): void {
      const center = this.map.getCenter();
      this.getNearByPois(center.lat(), center.lng());
   }
}
