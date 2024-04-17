import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';
import { Image } from 'src/app/models/fileUpload.model';
import { AuthenticationStorageService } from './authentication/authentication-storage.service';

@Injectable({ providedIn: 'root' })
export class ImageService {
   // http: any;

   constructor(private http: HttpClient, private authenticationStorageService: AuthenticationStorageService) {}
   /*
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  } */
   /*
  getGalleryById(id: string): Observable<Image> {
    const url = `${ApiURLStore.  apiUrl}/${id}`;
    return this.http.get<Image>(url).pipe(
      catchError(this.handleError)
    );
  } */

   uploadImg(gallery: Image, file: File, attachTo: string, idToAttach?: string, description?: string): Observable<any> {
      const formData = new FormData();
      const attachedTo = attachTo;
      formData.append('file', file);
      formData.append('imageTitle', gallery.imageTitle);
      formData.append('imageDesc', gallery.imageDesc);
      formData.append('attachedTo', attachedTo);
      if (description) {
         formData.append('imageDescription', description);
      }
      if (idToAttach) {
         formData.append('idToAttach', idToAttach);
      }
      const header = new HttpHeaders().set(
         'Authorization',
         `Bearer ${this.authenticationStorageService.getAccessToken()}`
      );
      return this.http.post<any>(ApiURLStore.UPLOAD_IMG, formData, { headers: header });
   }

   deleteGalleryImage(imageID: string, tourID: string) {
      const body = {
         tourID: tourID,
      };
      const options = {
         headers: this.authenticationStorageService
            .getRequestHeader()
            .set('Authorization', `Bearer ${this.authenticationStorageService.getAccessToken()}`),
         body,
      };
      return this.http.delete(`${ApiURLStore.DELETE_GALLERY_IMAGE_FILE}${imageID}`, options);
   }
}
