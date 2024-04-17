import { SnackBarService } from '../../../services/snack-bar.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Geocoordinates, GoogleResponse, Locations, PointOfInterest } from 'src/app/models/poi.model';
import { GoogleService } from 'src/app/services/requestServices/google.service';
import { PoiService } from 'src/app/services/requestServices/poi.service';
import { UserStorageService } from 'src/app/services/user/user-storage.service';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';

@Component({
   selector: 'app-poi-creation',
   templateUrl: './poi-creation.component.html',
   styleUrls: ['./poi-creation.component.css'],
})
export class PoiCreationComponent implements OnInit {
   @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
   @ViewChild(MapMarker, { static: false }) marker: MapMarker;
   @ViewChild('uploadImage') imageUpload: ImageUploadComponent;

   poiCreationForm: FormGroup;

   latitude: number;
   longitude: number;

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

   ownMarkerOptions: google.maps.MarkerOptions = {
      animation: google.maps.Animation.DROP,
      icon: '../../../assets/icons/gps32px.png',
      draggable: true,
   };

   constructor(
      private googleService: GoogleService,
      private poiService: PoiService,
      private snackBar: SnackBarService,
      private router: Router,
      private userService: UserStorageService
   ) {}

   ngOnInit(): void {
      this.getCurrentLocation();
      this.poiCreationForm = new FormGroup({
         name: new FormControl('', [Validators.required]),
         description: new FormControl('', [Validators.required]),
         imagePath: new FormControl(),
      });
   }

   onSubmit(): void {
      const newPoi: PointOfInterest = {
         name: this.poiCreationForm.get('name')?.value,
         description: this.poiCreationForm.get('description')?.value,
         geometry: this.getPositionOfMarker(),
         userName: this.userService.$userName,
         createdAt: new Date(),
      };
      this.poiService.addPoi(newPoi).subscribe(
         (data) => {
            this.snackBar.showSnackBar('Point of interest created successfully!', 3000, 'snackbar-success');
            this.resetForm(data._id);
            this.imageUpload.onFormSubmit(data._id, 'poi');
         },
         (error) => {
            this.snackBar.showSnackBar(error.errorMessage, 3000, 'snackbar-error');
         }
      );
   }

   getPositionOfMarker() {
      const lat = this.marker.marker?.getPosition()?.lat() as number;
      const lng = this.marker.marker?.getPosition()?.lng() as number;
      return new Locations(new Geocoordinates(lat, lng));
   }

   getCurrentLocation(): void {
      if (navigator.permissions && navigator.permissions.query) {
         navigator.permissions.query({ name: 'geolocation' }).then((status) => {
            if (status.state === 'granted' || status.state === 'prompt') {
               navigator.geolocation.getCurrentPosition((position) => {
                  this.center = {
                     lat: position.coords.latitude,
                     lng: position.coords.longitude,
                  };
               });
            }
         });
      }
   }

   searchLocation(location: string) {
      if (location !== null && location !== '') {
         this.googleService
            .getLocationInfo(location)
            .pipe(map((response: any) => response))
            .subscribe((data: GoogleResponse) => {
               if (data.status === 'OK') {
                  this.center.lat = data.results[0].geometry.location.lat;
                  this.center.lng = data.results[0].geometry.location.lng;
                  this.map.panTo(this.center);
                  this.marker.marker?.setPosition(this.center);
               }
            });
      }
   }

   resetForm(poiId: string | undefined): void {
      if (poiId !== undefined && poiId !== null) {
         this.poiCreationForm.reset();
         this.router.navigate([`/poi-detail-view/${poiId}`]);
      }
   }
}
