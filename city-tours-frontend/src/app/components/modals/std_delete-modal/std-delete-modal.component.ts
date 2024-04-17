import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
   selector: 'app-modals',
   templateUrl: './std-delete-modal.component.html',
   styleUrls: ['./std-delete-modal.component.css'],
})
export class StdDeleteModalComponent implements OnInit {
   @Input() contentStringID: string;
   @Input() additionalString: string;

   constructor(public modal: NgbActiveModal) {}

   ngOnInit(): void {}

   confirmDelete(confirmState: boolean) {
      this.modal.close(confirmState); // send data back to component
   }

   onClose(): void {
      this.modal.close();
   }
}
