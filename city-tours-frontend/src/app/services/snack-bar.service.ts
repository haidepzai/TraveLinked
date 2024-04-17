import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root',
})
export class SnackBarService {
   constructor(private _snackBar: MatSnackBar) {}

   /**
    *
    * @param message Message to display
    * @param duration duration untill the snackbar disapears
    * @param css css-class: 'snackbar-success' for succecss snackbars.
    * 'snackbar-error' for errors
    */
   showSnackBar(message: string, duration: number, css?: string) {
      this._snackBar.open(message, undefined, {
         duration,
         panelClass: ['mat-toolbar', css!],
      });
   }
}
