import { SnackBarService } from '../../../services/snack-bar.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, tap } from 'rxjs/operators';
import { PointOfInterest, Locations, Geocoordinates, GoogleResponse } from 'src/app/models/poi.model';
import { GoogleService } from 'src/app/services/requestServices/google.service';
import { PoiService } from 'src/app/services/requestServices/poi.service';
import { UserStorageService } from 'src/app/services/user/user-storage.service';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';

@Component({
   selector: 'app-poi-edit',
   templateUrl: './poi-edit.component.html',
   styleUrls: ['./poi-edit.component.css'],
})
export class PoiEditComponent implements OnInit {
   @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
   @ViewChild(MapMarker, { static: false }) marker: MapMarker;
   @ViewChild('uploadImage') imageUpload: ImageUploadComponent;

   poiEditForm: FormGroup;

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

   poi: PointOfInterest;

   constructor(
      private googleService: GoogleService,
      private poiService: PoiService,
      private snackBar: SnackBarService,
      private router: Router,
      private userService: UserStorageService,
      private route: ActivatedRoute
   ) {}

   ngOnInit(): void {
      this.route.params
         .pipe(
            mergeMap((params) => {
               console.log(params);
               return this.poiService.getPoi(params.poiid);
            }),
            tap((poi: PointOfInterest) => {
               this.poi = poi;
            })
         )
         .subscribe((data) => {
            if (this.poi.creator !== this.userService.$userID) {
               this.router.navigate(['/not-authorized']);
            }
            this.initializeForm();
            this.center.lat = this.poi.geometry.location.lat;
            this.center.lng = this.poi.geometry.location.lng;
         });
   }

   onSubmit(): void {
      const newPoi: PointOfInterest = {
         name: this.poiEditForm.get('name')?.value,
         description: this.poiEditForm.get('description')?.value,
         geometry: this.getPositionOfMarker(),
         userName: this.userService.$userName,
         createdAt: this.poi.createdAt,
         _id: this.poi._id,
      };
      console.log(newPoi);
      this.poiService.editPoi(newPoi).subscribe(
         (data) => {
            this.snackBar.showSnackBar('Point of interest successfully updated!', 3000, 'snackbar-success');
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
         this.poiEditForm.reset();
         this.router.navigate([`/poi-detail-view/${poiId}`]);
      }
   }

   initializeForm(): void {
      this.poiEditForm = new FormGroup({
         name: new FormControl(this.poi.name, [Validators.required]),
         description: new FormControl(this.poi.description, [Validators.required]),
         imagePath: new FormControl(this.poi.titleImage?.imageURL ?? ''),
      });
   }
}
