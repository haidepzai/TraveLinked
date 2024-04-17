import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
   selector: 'app-share-tour-modal',
   templateUrl: './share-tour-modal.component.html',
   styleUrls: ['./share-tour-modal.component.css'],
})
export class ShareTourModalComponent implements OnInit {
   @Input() fromParentState: boolean;
   @Input() fromParentTourName: string;
   @Input() fromParentTourState: boolean;

   constructor(public modal: NgbActiveModal) {}

   ngOnInit(): void {}

   shareTour(confirmState: boolean) {
      this.modal.close(confirmState); // send data back to component
   }

   onClose(): void {
      this.modal.close();
   }
}
