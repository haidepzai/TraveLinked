import { ImpressumComponent } from './../impressum/impressum.component';
import { ContactFormComponent } from './../contact-form/contact-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-footer',
   templateUrl: './footer.component.html',
   styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
   currentYear: number = new Date().getFullYear();

   contactDialogRef: MatDialogRef<ContactFormComponent, any> | null;
   impressumDialogRef: MatDialogRef<ImpressumComponent, any> | null;

   constructor(private dialog: MatDialog) {}

   ngOnInit(): void {}

   openContactForm(): void {
      this.contactDialogRef = this.dialog.open(ContactFormComponent, {
         backdropClass: 'backdropBackground',
      });

      this.contactDialogRef.afterClosed().subscribe((result) => {
         console.log(`Dialog result: ${result}`);
         this.contactDialogRef = null;
      });
   }

   openImpressum(): void {
      this.impressumDialogRef = this.dialog.open(ImpressumComponent, {
         panelClass: 'impressum-dialog',
         backdropClass: 'backdropBackground',
      });

      this.impressumDialogRef.afterClosed().subscribe((result) => {
         console.log(`Dialog result: ${result}`);
         this.impressumDialogRef = null;
      });
   }
}
