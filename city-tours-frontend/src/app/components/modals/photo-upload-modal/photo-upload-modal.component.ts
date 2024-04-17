import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageUploadComponent } from './../../image-upload/image-upload.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
   selector: 'app-photo-upload-modal',
   templateUrl: './photo-upload-modal.component.html',
   styleUrls: ['./photo-upload-modal.component.css'],
})
export class PhotoUploadModalComponent implements OnInit {
   @Input() fromParentTourID: string;
   @ViewChild('uploadImage') imageUpload: ImageUploadComponent;

   imageDescription: string;

   imgForm: FormGroup;

   successUpload: boolean = false;

   constructor(public modal: NgbActiveModal, private formBuilder: FormBuilder) {}

   ngOnInit(): void {
      this.imgForm = this.formBuilder.group({
         imageDescription: [null, [Validators.required]],
      });
   }

   onSubmit(): void {
      this.imageUpload.onFormSubmit(this.fromParentTourID, 'tourGallery', this.imageDescription);
   }

   onClose(state: boolean): void {
      this.modal.close(state);
   }

   receiveUploadStatus($event: boolean): void {
      this.successUpload = $event;
   }
}
