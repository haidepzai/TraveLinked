import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/services/requestServices/data.service';

@Component({
   selector: 'app-leave-tour-creation-modal',
   templateUrl: './leave-tour-creation-modal.component.html',
   styleUrls: ['./leave-tour-creation-modal.component.css'],
})
export class LeaveTourCreationModalComponent implements OnInit {
   constructor(public modal: NgbActiveModal, public dataService: DataService) {}

   ngOnInit(): void {}

   onClose(): void {
      this.modal.close();
   }

   selection(choice: boolean): void {
      this.dataService.setNavigateAway(choice);
      this.modal.close();
   }
}
