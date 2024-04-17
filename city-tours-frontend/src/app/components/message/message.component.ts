import { UserStorageService } from './../../services/user/user-storage.service';
import { PrivateChat } from './../../models/private-chat.model';
import { ChatService } from './../../services/requestServices/chat.service';
import { User } from './../../models/user.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { ProfileViewComponent } from '../profile-view/profile-view.component';

export interface DialogData {
   user: User;
}

@Component({
   selector: 'app-message',
   templateUrl: './message.component.html',
   styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit {
   contactForm: FormGroup;
   isSend: boolean = false;
   isLoading: boolean = false;

   constructor(
      private formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<ProfileViewComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
      private chatService: ChatService,
      private userStorageService: UserStorageService
   ) {}

   ngOnInit(): void {
      this.contactForm = this.formBuilder.group({
         message: [null, Validators.required],
      });
   }

   onSubmit(): void {
      console.log(this.contactForm.value);

      this.isLoading = true;

      const chat: PrivateChat = {
         _id: this.userStorageService.$userID,
         senderID: this.userStorageService.$userID,
         senderName: this.userStorageService.$userName,
         receiverID: this.data.user._id,
         receiverName: this.data.user.fullName,
         message: this.contactForm.get('message')?.value,
         createdAt: new Date(),
      };

      this.chatService.savePriavteMessage(chat).subscribe(
         (data) => {
            this.isSend = true;
            this.isLoading = false;
         },
         (error) => {
            console.log(error);
            this.isLoading = false;
         }
      );

      this.contactForm.reset();
   }
}
