import { UserStorageService } from './../../services/user/user-storage.service';
import { ChatService } from '../../services/requestServices/chat.service';
import { Component, OnInit } from '@angular/core';
import { ChatModel } from 'src/app/models/chat.model';
import { Router } from '@angular/router';

@Component({
   selector: 'app-chat',
   templateUrl: './chat.component.html',
   styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
   user: String;
   room: String;
   messageText: String;
   messageArray: ChatModel[] = [];
   role: String;

   constructor(
      private _chatService: ChatService,
      private userStorageService: UserStorageService,
      private router: Router
   ) {
      this._chatService.newUserJoined().subscribe((data) => this.messageArray.push(data));

      this._chatService.userLeftRoom().subscribe((data) => this.messageArray.push(data)); //Broadcast

      this._chatService.newMessageReceived().subscribe((data) => this.messageArray.push(data));
   }

   join() {
      this._chatService.joinRoom({
         user: this.user,
         room: this.room,
         _id: this.userStorageService.$userID,
      });
      this.messageArray = [];
      this.messageArray.push({ message: 'You have entered the room: ' + this.room }); //Just visible for the user
   }

   leave() {
      this._chatService.leaveRoom({ user: this.user, room: this.room });
      this.messageArray.push({ message: ' You have left the room: ' + this.room }); //Nur für den User sichtbar
   }

   sendMessage() {
      this._chatService.sendMessage({
         user: this.user,
         room: this.room,
         message: this.messageText,
         role: this.role,
         _id: this.userStorageService.$userID,
      });
      this.messageText = '';
   }

   ngOnInit(): void {
      this.user = this.userStorageService.$userName!;
      this.room = 'Lobby';
      this.role = this.userStorageService.$role!;
      this.join();
   }

   goToUserProfile(userID: String | undefined) {
      const url = this.router.createUrlTree(['/profile-view', userID]);
      window.open(url.toString(), '_blank');
   }
}
