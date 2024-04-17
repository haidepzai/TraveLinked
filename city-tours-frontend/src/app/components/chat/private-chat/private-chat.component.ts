import { PrivateChat } from './../../../models/private-chat.model';
import { UserStorageService } from '../../../services/user/user-storage.service';
import { ChatService } from '../../../services/requestServices/chat.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatModel } from 'src/app/models/chat.model';
import { User } from 'src/app/models/user.model';
import { map, tap, mergeMap, subscribeOn } from 'rxjs/operators';
import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';
import { pipe } from 'rxjs';
@Component({
   selector: 'app-private-chat',
   templateUrl: './private-chat.component.html',
   styleUrls: ['./private-chat.component.css'],
})
export class PrivateChatComponent implements OnInit {
   @ViewChild('chatBox') private chatBox: ElementRef;
   pictureURL: string;
   userName: string | undefined;
   room: string | undefined;
   receiverID: string; //ID Receiver
   receiver: User;
   messageText: string;
   messageArray: ChatModel[] = []; //messages which is shown in the UI
   userSearchList: User[] = [];
   contactedUsers: User[] = [];

   isLoading: boolean = false;
   selectedUser: User;

   userListLoading: boolean = false;
   isSearching: boolean = false;

   unreadMessages: PrivateChat[] = [];

   constructor(private _chatService: ChatService, private userStorageService: UserStorageService) {
      this._chatService.newPrivateMessageReceived().subscribe((data: PrivateChat) => {
         if (data._id === this.receiver._id) {
            this.messageArray.push(data);
         }
         console.log('Received Message: ' + data.message);
      });
   }

   ngOnInit(): void {
      this.userListLoading = true;
      this.userName = this.userStorageService.$userName;
      this.room = this.userStorageService.$userID; // unique ID for room
      this.join();
      this._chatService
         .getContactedUsers(this.room)
         .pipe(
            tap((users) => {
               this.contactedUsers = users;
            }),
            mergeMap((data) => {
               return this._chatService.getUnreadMessages(this.room);
            }),
            tap((chat) => {
               this.unreadMessages = chat;
            })
         )
         .subscribe(
            (data) => {
               this.userListLoading = false;
            },
            (err) => {
               console.log(err);
               this.userListLoading = false;
            }
         );
   }

   //Eigenen Raum joinen
   //Prinzip von Privaten Chat:
   //Jeder ist in seinem EIGENEN Raum (ID des Benutzers)
   //Nachricht an Empfänger wird an den Raum des Empfängers gesendet (ID des Empfängers)
   join() {
      this._chatService.joinRoom({ user: this.userName, room: this.room, _id: this.userStorageService.$userID });
   }

   sendMessage() {
      if (this.messageText.length > 0) {
         this.messageArray.push({ user: this.userName, message: this.messageText });

         const chat: PrivateChat = {
            _id: this.userStorageService.$userID,
            senderID: this.userStorageService.$userID,
            senderName: this.userName,
            receiverID: this.receiverID,
            receiverName: this.receiver.fullName,
            message: this.messageText,
            createdAt: new Date(),
         };

         this._chatService.sendPrivateMessage(chat);
         this._chatService.savePriavteMessage(chat).subscribe(
            (data) => {
               this.addToUserList();
            },
            (error) => {
               console.log(error);
            }
         );
      }

      this.messageText = ''; //Reset input field
   }

   searchUser(user: string) {
      if (user !== null && user !== '') {
         this.isSearching = true;
         this.userListLoading = true;
         const id = this.room;
         this._chatService
            .getUserByCharacter(user)
            .pipe(map((user) => user))
            .subscribe(
               (result: User[]) => {
                  this.userSearchList = result.filter((user) => {
                     return user._id !== id;
                  });
                  this.userListLoading = false;
               },
               (err) => {
                  console.log(err);
                  this.userListLoading = false;
               }
            );
      } else if (user === null || user === '') {
         this.userSearchList = [];
         this.userListLoading = false;
         this.isSearching = false;
      }
   }

   addToUserList() {
      let isInArray: Boolean = false;

      this.contactedUsers.forEach((user: User) => {
         if (user._id === this.receiverID) {
            isInArray = true;
            return;
         }
      });

      if (!isInArray) {
         this.contactedUsers.push(this.receiver);
         //TODO Save contacted user in DB
      }

      this.userSearchList = [];
   }

   clickUserName(user: User, index?: number) {
      this.getProfilePicture(user);
      this.messageArray = [];
      this.selectedUser = user;
      this.isLoading = true;
      this.receiverID = user._id;
      this.receiver = user;

      this._chatService.loadPrivateMessages(this.userStorageService.$userID!, this.receiverID).subscribe(
         (chat: PrivateChat) => {
            if (chat) {
               chat.messages?.forEach((element: ChatModel) => {
                  this.messageArray.push(element);
               });
            }
            this.isLoading = false;
         },
         (err) => {
            console.log(err);
         }
      );
      this._chatService.readPrivateMessage(this.receiverID, this.userStorageService.$userID!).subscribe(
         (data) => {
            //Update UI
            if (this.unreadMessages) {
               this.unreadMessages.map((x) => {
                  if (x.clientOne === user._id) {
                     x.hasRead = true;
                  }
               });
            }
         },
         (err) => {
            console.log(err);
         }
      );
   }

   getProfilePicture(user: User) {
      const url = user.profilePicture?.imageURL;

      const picture = `${ApiURLStore.GET_IMG}/${url}`;

      return picture;
   }
}
