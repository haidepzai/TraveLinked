import { ApiURLStore } from './../../models/ApiURLs/ApiURLStore';
import { Image } from './../../models/fileUpload.model';
import { SnackBarService } from './../../services/snack-bar.service';
import { PhotoUploadModalComponent } from './../modals/photo-upload-modal/photo-upload-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { ImageService } from 'src/app/services/requestServices/image.service';
import { StdDeleteModalComponent } from '../modals/std_delete-modal/std-delete-modal.component';

@Component({
   selector: 'app-photo-gallery',
   templateUrl: './photo-gallery.component.html',
   styleUrls: ['./photo-gallery.component.css'],
})
export class PhotoGalleryComponent implements OnInit {
   @Input() photoGallery: Image[] = []; // TODO: Retrieve images of Tour
   @Input() isOwnTour: boolean;
   @Output() photoEmitter = new EventEmitter<Image[]>();

   tourId: string;
   items: GalleryItem[];

   constructor(
      private imageService: ImageService,
      private route: ActivatedRoute,
      private _modalService: NgbModal,
      private snackBar: SnackBarService,
      public gallery: Gallery,
      public lightbox: Lightbox
   ) {
      this.route.params.subscribe((params) => {
         this.tourId = params.tourid;
      });
   }

   ngOnInit(): void {
      console.log(this.photoGallery);
      this.items = this.photoGallery.map(
         (item) =>
            new ImageItem({
               src: this.showImage(item.imageURL),
               thumb: this.showImage(item.imageURL),
            })
      );
      const lightboxRef = this.gallery.ref('lightbox');
      lightboxRef.setConfig({ imageSize: ImageSize.Contain, thumbPosition: ThumbnailsPosition.Bottom });
      lightboxRef.load(this.items);
   }

   openDialog(): void {
      let uploaded = false;

      const modalRef = this._modalService.open(PhotoUploadModalComponent);

      modalRef.componentInstance.fromParentTourID = this.tourId; // send data to modal

      modalRef.result.then((result) => {
         uploaded = result;

         if (uploaded) {
            window.location.reload();
            this.snackBar.showSnackBar('Successfully saved!', 5000, 'snackbar-success');
         }
      });
   }

   showImage(imgUrl: string): string {
      return `${ApiURLStore.GET_IMG}/${imgUrl}`;
   }

   deleteImage(image: Image, tourID: string) {
      const modalRef = this._modalService.open(StdDeleteModalComponent);
      modalRef.componentInstance.contentStringID = 'MODAL.DELETE_IMAGE';
      modalRef.result.then((res) => {
         if (res) {
            this.imageService.deleteGalleryImage(image.imageURL, tourID).subscribe((result: any) => {
               if (!result) {
                  this.snackBar.showSnackBar('Error on deleting Image', 5000, 'snackbar-error');
               } else if (result.errorMessage) {
                  this.snackBar.showSnackBar(result.errorMessage, 5000, 'snackbar-error');
               } else {
                  this.snackBar.showSnackBar('Successfully deleted Image', 5000, 'snackbar-success');
                  const filteredPhotos = this.photoGallery.filter((img) => img !== image);
                  this.photoEmitter.emit(filteredPhotos);
                  this.ngOnInit();
               }
            });
         }
      });
   }
}
