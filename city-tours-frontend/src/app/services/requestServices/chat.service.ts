import { ApiURLStore } from './../../models/ApiURLs/ApiURLStore';
import { PrivateChat } from './../../models/private-chat.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { ChatModel } from '../../models/chat.model';
import { AuthenticationStorageService } from './authentication/authentication-storage.service';
import { User } from 'src/app/models/user.model';

@Injectable()
export class ChatService {
   private socket = io(`${ApiURLStore.BASE_URL}/`);

   constructor(private http: HttpClient, private authStorage: AuthenticationStorageService) {}

   joinRoom(data: ChatModel) {
      this.socket.auth = { _id: data._id };
      this.socket.connect();
      this.socket.emit('join', data);
   }

   newUserJoined() {
      const observable = new Observable<ChatModel>((observer) => {
         // listen to the event 'new user joined' which is defined/emitted in the backend
         this.socket.on('new user joined', (data) => {
            observer.next(data);
         });
         return () => {
            this.socket.disconnect();
         };
      });

      return observable;
   }

   leaveRoom(data: ChatModel) {
      // emit the event 'leave' to the backend which will listen with socket.on('leave)
      this.socket.emit('leave', data);
   }

   //Listen to the event "left room" in the backend
   userLeftRoom() {
      const observable = new Observable<ChatModel>((observer) => {
         this.socket.on('left room', (data) => {
            observer.next(data);
         });
         return () => {
            this.socket.disconnect();
         };
      });

      return observable;
   }

   sendMessage(data: ChatModel) {
      this.socket.emit('message', data);
   }

   newMessageReceived() {
      const observable = new Observable<ChatModel>((observer) => {
         this.socket.on('new message', (data) => {
            observer.next(data);
         });
         return () => {
            this.socket.disconnect();
         };
      });

      return observable;
   }

   sendPrivateMessage(data: PrivateChat) {
      this.socket.emit('private message', data);
   }

   newPrivateMessageReceived() {
      const observable = new Observable<PrivateChat>((observer) => {
         this.socket.on('private message', (data) => {
            observer.next(data);
         });
         return () => {
            this.socket.disconnect();
         };
      });

      return observable;
   }

   getUserByCharacter(userName: string): Observable<User[]> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.get<User[]>(`${ApiURLStore.GET_USERS_BY_CHAR}/${userName}`, { headers });
   }

   getContactedUsers(userID: string | undefined): Observable<any> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getAccessToken()}`);
      return this.http.get<any>(`${ApiURLStore.GET_CONTACTED_USERS}/${userID}`, { headers });
   }

   savePriavteMessage(chat: PrivateChat): Observable<PrivateChat> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getStoredValue('accessToken')}`);
      const body = {
         chat,
      };
      return this.http.post<PrivateChat>(ApiURLStore.SAVE_CHAT_MESSAGE, body, {
         headers,
      });
   }

   loadPrivateMessages(senderID: string, receiverID: string): Observable<PrivateChat> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getStoredValue('accessToken')}`);
      const body = {
         senderID: senderID,
         receiverID: receiverID,
      };
      return this.http.post<PrivateChat>(ApiURLStore.GET_CHAT_MESSAGES, body, {
         headers,
      });
   }

   readPrivateMessage(senderID: string, receiverID: string): Observable<PrivateChat> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getStoredValue('accessToken')}`);
      const body = {
         senderID: senderID,
         receiverID: receiverID,
      };
      return this.http.post<PrivateChat>(ApiURLStore.READ_MESSAGE, body, {
         headers,
      });
   }

   getUnreadMessages(userID: string | undefined): Observable<PrivateChat[]> {
      const headers = this.authStorage
         .getRequestHeader()
         .set('Authorization', `Bearer ${this.authStorage.getStoredValue('accessToken')}`);
      return this.http.get<PrivateChat[]>(`${ApiURLStore.GET_UNREAD_MESSAGES}/${userID}`, {
         headers,
      });
   }
}
