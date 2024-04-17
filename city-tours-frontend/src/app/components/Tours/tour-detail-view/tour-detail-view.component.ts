import { Image } from './../../../models/fileUpload.model';
import { ToDo } from './../../../models/todo.model';
import { ShareTourModalComponent } from './../../modals/share-tour-modal/share-tour-modal.component';
import { Comments } from '../../../models/comment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StdDeleteModalComponent } from '../../modals/std_delete-modal/std-delete-modal.component';
import { UserStorageService } from '../../../services/user/user-storage.service';
import { PointOfInterest } from '../../../models/poi.model';
import { Tour } from '../../../models/tour.model';
import { TourService } from 'src/app/services/requestServices/tour.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap, min, tap } from 'rxjs/operators';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';
import { ImageHelperService } from 'src/app/services/image-helper.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
   selector: 'app-tour-detail-view',
   templateUrl: './tour-detail-view.component.html',
   styleUrls: ['./tour-detail-view.component.css'],
})
export class TourDetailViewComponent implements OnInit {
   @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
   @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;

   comments: Comments[] = [];
   todos: ToDo[] = [];
   photoGallery: Image[] = [];

   directionsService = new google.maps.DirectionsService();

   directionsMatrix = new google.maps.DistanceMatrixService();

   directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      suppressInfoWindows: true,
      polylineOptions: {
         strokeColor: '#FF4081',
         strokeWeight: 6,
         strokeOpacity: 0.6,
      },
   });

   tour: Tour;
   isLoading: boolean = false;
   isOwnTour: boolean = false;
   hasLiked: boolean = false;
   showRoute: boolean = false;
   overview: number = 1;

   imgSrc: string | undefined;
   userName: string | undefined;
   likes: number;

   // Selected Poi in the map
   poi: PointOfInterest;

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

   // Informationen über die Route:
   distance: string = '';
   time: string = '';

   constructor(
      private tourService: TourService,
      private route: ActivatedRoute,
      private userStorageService: UserStorageService,
      private _modalService: NgbModal,
      private router: Router,
      private snackbarService: SnackBarService,
      private _snackBar: MatSnackBar,
      private imageService: ImageHelperService
   ) {}

   ngOnInit(): void {
      this.isLoading = true;
      this.route.params
         .pipe(
            mergeMap((params) => {
               return this.tourService.getTourByID(params.tourid);
            }),
            tap((data: Tour) => {
               this.tour = data;
               this.userName = this.tour.userName;
               this.likes = this.tour.likes;
               this.comments = data.comments ?? [];
               this.todos = data.todos ?? [];
               this.photoGallery = data.photoGallery ?? [];
            })
         )
         .subscribe(
            (data: Tour) => {
               console.log(data.titleImage?.imageURL);
               this.imgSrc =
                  data.titleImage?.imageURL !== null
                     ? `${ApiURLStore.GET_IMG}/${data.titleImage?.imageURL}`
                     : './../../../assets/images/background_1.jpg';
               //Fallback when no image exists in the backend
               this.setMapCenter();
               this.checkOwnTour();
               this.isLoading = false;
            },
            (error) => console.log(error)
         );
   }

   openInfo(marker: MapMarker, poi: PointOfInterest) {
      this.poi = poi;
      this.info.open(marker);
   }

   setMapCenter(): void {
      this.center.lat = this.tour.sights[0].geometry.location.lat;
      this.center.lng = this.tour.sights[0].geometry.location.lng;
   }

   checkOwnTour(): void {
      if (this.userStorageService.$userID === this.tour.creator) {
         this.isOwnTour = true;
      } else {
         this.isOwnTour = false;
         if (this.userStorageService.$userID !== undefined || this.userStorageService.$userID !== '') {
            this.checkHasLiked();
         } else {
            this.hasLiked = false;
         }
      }
   }

   checkHasLiked(): void {
      if (this.tour.likedUsers?.includes(this.userStorageService.$userID!)) {
         this.hasLiked = true;
      } else {
         this.hasLiked = false;
      }
   }

   onDelete(tourId: string | undefined, tourName: string | undefined): void {
      let confirmed = false;

      const modalRef = this._modalService.open(StdDeleteModalComponent);
      modalRef.componentInstance.contentStringID = 'MODAL.DELETE_TOUR';
      modalRef.componentInstance.additionalString = tourName; // send data to modal

      modalRef.result
         .then((result: boolean) => {
            confirmed = result;

            if (confirmed) {
               this.tourService.deleteTour(tourId).subscribe(
                  (data) => {
                     this.snackbarService.showSnackBar('Successfully deleted tour', 5000, 'snackbar-success');
                     this.router.navigate(['/tour-dashboard/my-tours']);
                  },
                  (error) => {
                     console.log(error);
                  }
               );
            }
         })
         .catch((error) => {});
   }

   onLike(tourId: string | undefined): void {
      if (!this.userStorageService.$loggedIn) {
         this.showSnackBar('Please login to like a Tour!', 'snackbar-error');
         return;
      }

      if (this.hasLiked) {
         this.tourService.unlikeTour(tourId).subscribe(
            (data) => {
               this.showSnackBar(data.successMessage, 'snackbar-success');
               this.likes -= 1;
            },
            (error) => {
               this.showSnackBar(error.errorMessage, 'snackbar-error');
            }
         );
         this.hasLiked = false;
      } else {
         this.tourService.likeTour(tourId).subscribe(
            (data) => {
               this.showSnackBar(data.successMessage, 'snackbar-success');
               this.likes += 1;
            },
            (error) => {
               this.showSnackBar(error.errorMessage, 'snackbar-error');
            }
         );
         this.hasLiked = true;
      }
   }

   onEdit(tourId: string | undefined): void {
      this.router.navigate([`/edit-tour/${tourId}`]);
   }

   showSnackBar(message: string, css: string) {
      this._snackBar.open(message, undefined, {
         duration: 3000,
         panelClass: ['mat-toolbar', css],
      });
   }

   changeShowRoute() {
      this.showRoute = !this.showRoute;
      if (this.showRoute) {
         this.getRoute();
      } else {
         this.directionsRenderer.setMap(null);
         this.map.googleMap?.controls[google.maps.ControlPosition.TOP_CENTER].clear();
      }
   }

   getRoute() {
      this.directionsRenderer.setMap(this.map.googleMap!);
      const sights = this.tour.sights;
      const origin = sights[0].geometry.location;
      const destination = sights[sights.length - 1].geometry.location;
      const ways = sights.slice(1, -1);
      const waypoints: google.maps.DirectionsWaypoint[] = [];

      ways.forEach((sight) => {
         waypoints.push({
            location: new google.maps.LatLng(sight.geometry.location.lat, sight.geometry.location.lng),
            stopover: true,
         });
      });

      this.directionsService.route(
         {
            origin,
            destination,
            waypoints,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
         },
         (response, status) => {
            if (status == google.maps.DirectionsStatus.OK) {
               this.directionsRenderer.setDirections(response);
               this.calculateTravelTimeAndDistance(response.routes[0]);
               response.routes[0].waypoint_order;
            } else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
               this.showSnackBar('No route found for your tour.', 'snackbar-error');
            }
         }
      );
   }

   calculateTravelTimeAndDistance(route: google.maps.DirectionsRoute): void {
      let distance: number = 0;
      let seconds: number = 0;
      let from: string = '';
      let to: string = '';

      route.legs.forEach((leg) => {
         distance += leg.distance.value;
         seconds += leg.duration.value;
         from = leg.start_address;
         to = leg.end_address;
      });

      let hours = new Date(seconds * 1000).toISOString().substr(11, 2);
      let minutes = new Date(seconds * 1000).toISOString().substr(14, 2);

      this.time = hours + ' h ' + minutes + ' min';
      this.distance = String(~~(distance / 1000)) + ' km';

      const controlText = document.createElement('div');
      controlText.style.color = 'rgb(25,25,25)';
      controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
      controlText.style.backgroundColor = '#fff';
      controlText.style.fontSize = '16px';
      controlText.style.padding = '5px';
      controlText.style.margin = '5px';
      controlText.innerHTML = 'Time: ' + this.time + '<br>' + 'Distance: ' + this.distance;

      this.map.googleMap?.controls[google.maps.ControlPosition.TOP_CENTER].push(controlText);
   }

   shareTour(): void {
      let confirmed = false;

      const modalRef = this._modalService.open(ShareTourModalComponent);

      modalRef.componentInstance.fromParentState = confirmed; // send data to modal
      modalRef.componentInstance.fromParentTourName = this.tour.name; // send data to modal
      modalRef.componentInstance.fromParentTourState = this.tour.isShared; // send data to modal

      modalRef.result
         .then((result: boolean) => {
            confirmed = result;

            if (confirmed) {
               this.tourService.shareTour(this.tour._id).subscribe(
                  (data: Tour) => {
                     if (data.isShared) {
                        this.showSnackBar('Tour successfully shared', 'snackbar-success');
                     } else {
                        this.showSnackBar('Tour successfully unshared', 'snackbar-success');
                     }
                  },
                  (error) => {
                     this.showSnackBar(error.error.errorMessage, 'snackbar-error');
                  }
               );
            }
         })
         .catch((error) => {});
   }

   goToUserProfile(userID: string | undefined) {
      this.router.navigate([`/profile-view/${userID}`]);
   }

   getImageOfPoi(src: string) {
      return `${ApiURLStore.GET_IMG}/${src}`;
   }
}
