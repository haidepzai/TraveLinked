import { ChatModel } from 'src/app/models/chat.model';
export interface PrivateChat {
   senderID?: String;
   senderName?: String;
   receiverID?: String;
   receiverName?: String;
   message?: String;
   createdAt?: Date;
   updatedAt?: Date;
   _id?: String;
   messages?: ChatModel[];
   hasRead?: boolean;
   clientOne?: String;
   clientTwo?: String;
}
