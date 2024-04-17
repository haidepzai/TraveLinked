import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ImageService } from 'src/app/services/requestServices/image.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
   selector: 'app-image-upload',
   templateUrl: './image-upload.component.html',
   styleUrls: ['./image-upload.component.css'],
})
export class ImageUploadComponent implements OnInit {
   @Output() successUpload = new EventEmitter<boolean>();
   imgForm: FormGroup;
   imageFile: File;
   imageTitle = '';
   imageDesc = '';
   isLoadingResults = false;
   fileSrc: string[] = [];

   constructor(
      private snackBar: SnackBarService,
      private imgUploadService: ImageService,
      private formBuilder: FormBuilder
   ) {}

   ngOnInit(): void {
      this.imgForm = this.formBuilder.group({
         imageFile: [null, Validators.required],
         imageTitle: [null, Validators.required],
         imageDesc: [null, Validators.required],
      });
   }

   showPreview(event: any) {
      const reader = new FileReader();
      if (!event.target.files[0].type.startsWith('image')) {
         this.snackBar.showSnackBar('Only files of type jpg, gif or png are allowed', 5000, 'snackbar-error');
         return;
      }
      if (event.target.files && event.target.files.length) {
         const [file] = event.target.files;
         reader.readAsDataURL(file);
         reader.onload = () => {
            console.log(reader.result);
            this.fileSrc.push(reader.result as string);
         };
      }
   }

   clear() {
      this.fileSrc = [];
      this.imgForm.reset();
   }

   onFormSubmit(idToAttachFiles: string | undefined, attachTo: string, description?: string): void {
      if (!this.imgForm.value.imageFile) return;

      if (!idToAttachFiles) {
         this.snackBar.showSnackBar('Error on creating tour with images', 5000, 'snackbar-error');
         return;
      }
      this.isLoadingResults = true;
      this.imgUploadService
         .uploadImg(
            this.imgForm.value,
            (this.imgForm.get('imageFile') as AbstractControl).value._files[0],
            attachTo,
            idToAttachFiles,
            description
         )
         .subscribe(
            (res: any) => {
               this.isLoadingResults = false;
               this.successUpload.emit(true);
               console.log(res);
               this.snackBar.showSnackBar('Photo successfully uploaded', 5000, 'snackbar-success');
            },
            (err: any) => {
               console.log(err);
               this.isLoadingResults = false;
               this.successUpload.emit(false);
            }
         );
   }
}
