export interface Comments {
   _id: string;
   userId?: string;
   userName: string;
   currentDate: Date;
   commentTxt: string;
   likes: number;
   likedUsers?: string[];
   hasNotLiked?: boolean;
}
