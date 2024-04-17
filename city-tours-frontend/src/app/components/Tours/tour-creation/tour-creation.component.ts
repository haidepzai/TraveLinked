import { SnackBarService } from '../../../services/snack-bar.service';
import { UserStorageService } from '../../../services/user/user-storage.service';
import { ComponentCanDeactivate } from '../../../guards/tour-creation.guard';
import { Tour } from '../../../models/tour.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { map, mergeMap, tap, switchMap } from 'rxjs/operators';
import { GoogleService } from 'src/app/services/requestServices/google.service';
import { TourService } from 'src/app/services/requestServices/tour.service';
import { Router } from '@angular/router';
import { GoogleResponse, PointOfInterest } from 'src/app/models/poi.model';
import { PoiService } from 'src/app/services/requestServices/poi.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LeaveTourCreationModalComponent } from '../../modals/leave-tour-creation-modal/leave-tour-creation-modal.component';
import { DataService } from 'src/app/services/requestServices/data.service';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';
import { of, forkJoin } from 'rxjs';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';

@Component({
   selector: 'app-tour-creation',
   templateUrl: './tour-creation.component.html',
   styleUrls: ['./tour-creation.component.css'],
})
export class TourCreationComponent implements OnInit, ComponentCanDeactivate {
   @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
   @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;
   @ViewChild('uploadImage') imageUpload: ImageUploadComponent;

   saved = false;
   tourCreationForm: FormGroup;

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

   nextPageToken: string | undefined;

   //Geo-coordinates for the tour
   cityName: string;
   //Needed for weather when searching for sights
   lat: number;
   lng: number;

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
   };

   showList: boolean = false;
   isLoading: boolean = false;

   constructor(
      private googleService: GoogleService,
      private TourService: TourService,
      private snackBar: SnackBarService,
      private router: Router,
      private poiService: PoiService,
      private userStorageService: UserStorageService,
      private _modalService: NgbModal,
      private dataService: DataService
   ) {}

   ngOnInit(): void {
      this.getOwnCreatedPois();
      this.getCurrentLocation();
      this.tourCreationForm = new FormGroup({
         name: new FormControl('', [Validators.required]),
         description: new FormControl('', [Validators.required]),
         date: new FormGroup({
            startDate: new FormControl('', [Validators.required]),
            endDate: new FormControl('', [Validators.required]),
         }),
      });
      this.googleService.getLocationName().subscribe((loc) => {
         this.cityName = loc;
      });
   }

   drop(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.sights, event.previousIndex, event.currentIndex);
   }

   getCurrentLocation() {
      if (navigator.permissions && navigator.permissions.query) {
         navigator.permissions.query({ name: 'geolocation' }).then((status) => {
            if (status.state === 'granted' || status.state === 'prompt') {
               navigator.geolocation.getCurrentPosition((position) => {
                  this.center = {
                     lat: position.coords.latitude,
                     lng: position.coords.longitude,
                  };
                  this.lat = position.coords.latitude;
                  this.lng = position.coords.longitude;
                  this.getNearByPois(this.center.lat, this.center.lng);
               });
            }
         });
      } else {
         this.getNearByPois(this.center.lat, this.center.lng);
      }
   }

   getNearByPois(lat: number, lng: number): void {
      if (lat !== null && lng !== null) {
         this.isLoading = true;
         this.lat = lat;
         this.lng = lng;

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
               tap((res: GoogleResponse) => {
                  if (res.status === 'OK') {
                     this.lat = res.results[0].geometry.location.lat;
                     this.lng = res.results[0].geometry.location.lng;
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
                  this.googleService.setLocationName(location);
               }
            });
      }
   }

   addPoiToSights(poi: PointOfInterest): void {
      if (!this.sights.includes(poi)) {
         this.sights.push(poi);
         if (this.info) {
            this.info.close();
         }
         this.snackBar.showSnackBar('Successfully added Point of Interest', 3000, 'snackbar-success');
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
      if (this.sights.length > 3) {
         this.isLoading = true;
         const newTour: Tour = {
            name: this.tourCreationForm.get('name')?.value,
            description: this.tourCreationForm.get('description')?.value,
            createdAt: new Date(),
            sights: this.sights,
            likes: 0,
            userName: this.userStorageService.$userName!,
            startDate: this.tourCreationForm.get('date.startDate')?.value,
            endDate: this.tourCreationForm.get('date.endDate')?.value,
            cityName: this.cityName,
         };
         this.TourService.addTour(newTour).subscribe(
            (data) => {
               this.saved = true;
               this.snackBar.showSnackBar('Tour successfully created!', 3000, 'snackbar-success');
               this.resetForm(data._id);
               this.imageUpload.onFormSubmit(data._id, 'tour');
            },
            (error) => {
               console.log(error);
               this.isLoading = false;
               this.snackBar.showSnackBar(error.error.errorMessage, 3000, 'snackbar-error');
            }
         );
      } else {
         this.snackBar.showSnackBar('You need to add at least 4 sights for you tour!', 3000, 'snackbar-error');
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
      if (!this.saved) {
         this._modalService.open(LeaveTourCreationModalComponent);
         return this.dataService.getNavigateAway();
      }
      return true;
   }

   getOwnCreatedPois(): void {
      this.poiService
         .getPois()
         .pipe(map((response) => response))
         .subscribe((data: PointOfInterest[]) => {
            this.listOfOwnPoi = data;
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

   searchInThisArea(): void {
      const center = this.map.getCenter();
      this.getNearByPois(center.lat(), center.lng());
   }
}
