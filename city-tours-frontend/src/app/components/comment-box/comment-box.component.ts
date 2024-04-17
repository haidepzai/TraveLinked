import { SnackBarService } from './../../services/snack-bar.service';
import { TourService } from 'src/app/services/requestServices/tour.service';
import { UserStorageService } from './../../services/user/user-storage.service';
import { Comments } from './../../models/comment.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { StdDeleteModalComponent } from '../modals/std_delete-modal/std-delete-modal.component';

@Component({
   selector: 'app-comment-box',
   templateUrl: './comment-box.component.html',
   styleUrls: ['./comment-box.component.css'],
})
export class CommentBoxComponent implements OnInit {
   @Input() comments: Comments[] = [];

   commentForm: FormGroup;
   submitted: Boolean = false;
   tourId: string;
   userId: string | undefined;

   comment: string;
   count = 0;

   isAdminMode = false;
   hasClickedOnLike = false;

   @Output() usercomment = new EventEmitter();
   @Output() countComments = new EventEmitter();

   constructor(
      private formBuilder: FormBuilder,
      private userStorageService: UserStorageService,
      private snackBar: SnackBarService,
      private tourService: TourService,
      private route: ActivatedRoute,
      private _modalService: NgbModal,
      private router: Router
   ) {}

   ngOnInit() {
      this.createForm();
      if (this.userStorageService.$role === 'Admin') {
         this.isAdminMode = true;
      }
      this.route.params.subscribe((params) => {
         this.tourId = params.tourid;
      });
      this.userId = this.userStorageService.$userID;
   }

   createForm(): void {
      this.commentForm = this.formBuilder.group({
         comment: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      });
   }

   removeComment(commentId: string) {
      let confirmed = false;

      const modalRef = this._modalService.open(StdDeleteModalComponent);
      modalRef.componentInstance.contentStringID = 'MODAL.DELETE_COMMENT';

      modalRef.componentInstance.fromParentState = confirmed; // send data to modal

      modalRef.result
         .then((result) => {
            confirmed = result;

            if (confirmed) {
               // Remove from UI
               const pos = this.comments
                  .map((comment) => {
                     return comment._id;
                  })
                  .indexOf(commentId);
               this.comments.splice(pos, 1);
               // this.countComments.emit(this.commentInfo);
               this.saveComment();
               this.snackBar.showSnackBar('Comment successfully deleted', 3000, 'snackbar-success');
            }
         })
         .catch((error) => {});
   }

   likeComment(commentId: string) {
      if (!this.userStorageService.$loggedIn) {
         this.snackBar.showSnackBar('Please login to like comment', 3000, 'snackbar-error');
         return;
      }

      let comment = this.comments.find((x) => x._id === commentId);

      if (comment) {
         if (comment.likedUsers?.includes(this.userStorageService.$userID!)) {
            if (this.hasClickedOnLike) {
               this.tourService.likeComment(this.tourId, commentId).subscribe(
                  (data) => {
                     if (comment) {
                        //To update the UI
                        comment.likes += 1;
                        this.hasClickedOnLike = false;
                        this.snackBar.showSnackBar('Successfully like comment', 3000, 'snackbar-success');
                     }
                  },
                  (error) => {
                     console.log(error);
                  }
               );
            } else {
               this.tourService.unlikeComment(this.tourId, commentId).subscribe(
                  (data) => {
                     if (comment) {
                        //To update the UI
                        comment.likes -= 1;
                        this.hasClickedOnLike = true;
                        this.snackBar.showSnackBar('Successfully unlike comment', 3000, 'snackbar-success');
                     }
                  },
                  (error) => {
                     console.log(error);
                  }
               );
            }
         } else if (!this.hasClickedOnLike) {
            this.tourService.likeComment(this.tourId, commentId).subscribe(
               (data) => {
                  if (comment) {
                     //To update the UI
                     comment.likes += 1;
                     comment.likedUsers?.push(this.userStorageService.$userID!);
                     this.hasClickedOnLike = true;
                     this.snackBar.showSnackBar('Successfully like comment', 3000, 'snackbar-success');
                  }
               },
               (error) => {
                  console.log(error);
               }
            );
         } else {
            this.tourService.unlikeComment(this.tourId, commentId).subscribe(
               (data) => {
                  if (comment) {
                     //To update the UI
                     comment.likes -= 1;
                     this.hasClickedOnLike = false;
                     this.snackBar.showSnackBar('Successfully unlike comment', 3000, 'snackbar-success');
                  }
               },
               (error) => {
                  console.log(error);
               }
            );
         }
      }
   }

   onSubmit(): void {
      // stop here if user is not logged in
      if (!this.userStorageService.$loggedIn) {
         this.snackBar.showSnackBar('Please login to send comments', 3000, 'snackbar-error');
         return;
      }
      this.submitted = true;
      // stop here if form is invalid
      if (this.commentForm.invalid) {
         return;
      } else {
         this.comments.push({
            _id: UUID.UUID(),
            userId: this.userStorageService.$userID!,
            userName: this.userStorageService.$userName!,
            currentDate: new Date(),
            commentTxt: this.commentForm.controls.comment.value,
            likes: 0,
         });
         this.resetForm();
         // this.usercomment.emit(this.commentInfo);
         this.saveComment();
      }
   }

   saveComment(): void {
      this.tourService.saveComments(this.tourId, this.comments).subscribe(
         (data) => {
            console.log(data);
         },
         (error) => {
            console.log(error);
         }
      );
   }

   resetForm(): void {
      this.submitted = false;
      this.commentForm.reset();
      this.commentForm.markAsPristine();
   }

   // Die folgenden Methoden könnte man benutzen,
   // um die Comments an die Eltern zu übergeben
   receiveComment($event: any) {
      this.comment = $event;
      this.count = this.comments.length;
      console.log(this.comments.length);
   }

   recieveCount($event: any) {
      this.comment = $event;
      this.count = this.comments.length;
   }

   goToUserProfile(userID: string | undefined) {
      this.router.navigate([`/profile-view/${userID}`]);
   }
}
