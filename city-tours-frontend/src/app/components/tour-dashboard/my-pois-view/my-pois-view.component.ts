import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PointOfInterest } from 'src/app/models/poi.model';
import { PoiService } from 'src/app/services/requestServices/poi.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ImageHelperService } from 'src/app/services/image-helper.service';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';
import { StdDeleteModalComponent } from '../../modals/std_delete-modal/std-delete-modal.component';

@Component({
   selector: 'app-my-pois-view',
   templateUrl: './my-pois-view.component.html',
   styleUrls: ['./my-pois-view.component.css'],
})
export class MyPoisViewComponent implements OnInit {
   myPois: PointOfInterest[] = [];
   isLoading = false;
   onDelBtn = false;
   searchTerm: string;

   constructor(
      private router: Router,
      private _modalService: NgbModal,
      private snackBar: SnackBarService,
      private poiService: PoiService,
      private imageService: ImageHelperService
   ) {
      this.isLoading = true;
   }

   ngOnInit(): void {
      this.poiService.getPoisOfUser().subscribe(
         (data) => {
            this.myPois = data;
            this.isLoading = false;
         },
         (error) => {
            console.log(error);
            this.isLoading = false;
         }
      );
   }

   goToPoiOverview(poiId: string | undefined): void {
      this.router.navigate([`/poi-detail-view/${poiId}`]);
   }

   deleteDialog(poiId: string | undefined, poiName: string): void {
      let confirmed = false;

      const modalRef = this._modalService.open(StdDeleteModalComponent);
      modalRef.componentInstance.contentStringID = 'MODAL.DELETE_POI';
      modalRef.componentInstance.additionalString = poiName;
      // send data to modal

      modalRef.result.then((result) => {
         confirmed = result;

         if (confirmed) {
            this.poiService.deletePoi(poiId).subscribe(
               (data) => {
                  console.log(data);
                  // Delete tour from UI => filter tour by id
                  this.myPois = this.myPois.filter((poi) => poi._id !== poiId);
               },
               (error) => {
                  console.log(error);
               }
            );
            this.snackBar.showSnackBar('Poi successfully deleted', 5000, 'snackbar-success');
         }
      });
   }

   sortBy(indicator: string): void {
      switch (indicator) {
         case 'creationDate':
            this.myPois.sort(function (a, b) {
               if (a.createdAt < b.createdAt) {
                  return -1;
               }
               if (a.createdAt > b.createdAt) {
                  return 1;
               }
               return 0;
            });
            break;
         case 'alphabetical_az':
            this.myPois.sort(function (a, b) {
               if (a.name.toLowerCase() < b.name.toLowerCase()) {
                  return -1;
               }
               if (a.name.toLowerCase() > b.name.toLowerCase()) {
                  return 1;
               }
               return 0;
            });
            break;
         case 'alphabetical_za':
            this.myPois.sort(function (a, b) {
               if (a.name.toLowerCase() > b.name.toLowerCase()) {
                  return -1;
               }
               if (a.name.toLowerCase() < b.name.toLowerCase()) {
                  return 1;
               }
               return 0;
            });
            break;
         default:
            break;
      }
   }

   getImageOfPoi(src: string) {
      return `${ApiURLStore.GET_IMG}/${src}`;
   }
}
