import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';
import { PointOfInterest } from 'src/app/models/poi.model';
import { PoiService } from 'src/app/services/requestServices/poi.service';
import { UserStorageService } from 'src/app/services/user/user-storage.service';
import { StdDeleteModalComponent } from '../../modals/std_delete-modal/std-delete-modal.component';

@Component({
   selector: 'app-poi-detail-view',
   templateUrl: './poi-detail-view.component.html',
   styleUrls: ['./poi-detail-view.component.css'],
})
export class PoiDetailViewComponent implements OnInit {
   @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

   poi: PointOfInterest;

   imgSrc: string | undefined;

   creator: boolean = false;
   isLoading: boolean = false;

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
      icon: '../../../assets/icons/gps32px.png',
   };

   constructor(
      private route: ActivatedRoute,
      private router: Router,
      private poiService: PoiService,
      private modalService: NgbModal,
      private userService: UserStorageService
   ) {}

   ngOnInit(): void {
      this.isLoading = true;
      this.route.params
         .pipe(
            mergeMap((params) => {
               console.log(params);
               return this.poiService.getPoi(params.poiid);
            })
         )
         .subscribe(
            (data: PointOfInterest) => {
               this.poi = data;
               this.center.lat = this.poi.geometry.location.lat;
               this.center.lng = this.poi.geometry.location.lng;
               this.imgSrc =
                  data.titleImage?.imageURL !== null
                     ? `${ApiURLStore.GET_IMG}/${data.titleImage?.imageURL}`
                     : './../../../assets/images/background_1.jpg';
               if (this.poi.creator === this.userService.$userID) {
                  this.creator = true;
               } else {
                  this.creator = false;
               }
               this.isLoading = false;
            },
            (error) => {
               console.log(error);
            }
         );
   }

   onDelete(poiId: string | undefined, poiName: string | undefined): void {
      let confirmed = false;

      const modalRef = this.modalService.open(StdDeleteModalComponent);
      modalRef.componentInstance.contentStringID = 'MODAL.DELETE_POI';
      modalRef.componentInstance.additionalString = poiName; // send data to modal

      modalRef.result
         .then((result: boolean) => {
            confirmed = result;

            if (confirmed) {
               this.poiService.deletePoi(poiId).subscribe(
                  (data) => {
                     this.router.navigate(['/']);
                  },
                  (error) => {
                     console.log(error);
                  }
               );
            }
         })
         .catch((error) => {});
   }

   onEdit(poiId: string | undefined): void {
      this.router.navigate([`/poi-edit/${poiId}`]);
   }

   goToUserProfile(userID: string | undefined) {
      this.router.navigate([`/profile-view/${userID}`]);
   }
}
