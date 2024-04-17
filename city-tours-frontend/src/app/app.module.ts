import { MaterialModule } from './material-module/material-module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { TruncatePipe } from './helper/pipe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppBootstrapModule } from './app-bootstrap/app-bootstrap.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { SightseeingViewComponent } from './components/sightseeing-view/sightseeing-view.component';
import { MyToursViewComponent } from './components/tour-dashboard/my-tours-view/my-tours-view.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SearchComponent } from './components/search/search.component';
import { TopToursViewComponent } from './components/home/top-tours-view/top-tours-view.component';
import { FooterComponent } from './components/footer/footer.component';
import { TourCreationComponent } from './components/Tours/tour-creation/tour-creation.component';
import { ConfirmationViewComponent } from './components/confirmation-view/confirmation-view.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { TourDetailViewComponent } from './components/Tours/tour-detail-view/tour-detail-view.component';
import { TourDashboardComponent } from './components/tour-dashboard/tour-dashboard.component';
import { ChatComponent } from './components/chat/chat.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { EditProfileViewComponent } from './components/profile-view/edit-profile-view/edit-profile-view/edit-profile-view.component';
import { DeleteProfileDialogComponent } from './components/profile-view/edit-profile-view/delete-profile-dialog/delete-profile-dialog.component';
import { PoiCreationComponent } from './components/PointsOfInterests/poi-creation/poi-creation.component';
import { ChatService } from './services/requestServices/chat.service';
import { TourCreationGuard } from './guards/tour-creation.guard';
import { AuthGuard } from './guards/auth.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StdDeleteModalComponent } from './components/modals/std_delete-modal/std-delete-modal.component';
import { PrivateChatComponent } from './components/chat/private-chat/private-chat.component';
import { EditTourComponent } from './components/Tours/edit-tour/edit-tour.component';
import { ActiveToursComponent } from './components/home/active-tours/active-tours.component';
import { PoiDetailViewComponent } from './components/PointsOfInterests/poi-detail-view/poi-detail-view.component';
import { LeaveTourCreationModalComponent } from './components/modals/leave-tour-creation-modal/leave-tour-creation-modal.component';
import { CommentBoxComponent } from './components/comment-box/comment-box.component';
import { PoiEditComponent } from './components/PointsOfInterests/poi-edit/poi-edit.component';
import { SearchPipe } from './helper/search.pipe';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthInterceptor } from './services/requestServices/authentication/AuthInterceptor';
import { LikedToursComponent } from './components/tour-dashboard/liked-tours/liked-tours.component';
import { ShareTourModalComponent } from './components/modals/share-tour-modal/share-tour-modal.component';
import { MyPoisViewComponent } from './components/tour-dashboard/my-pois-view/my-pois-view.component';
import { SearchPipePoi } from './helper/searchPoi.pipe';
import { TodoComponent } from './components/todo/todo.component';
import { TourResultViewComponent } from './components/tour-result-view/tour-result-view.component';
import { ProfileViewComponent } from './components/profile-view/profile-view.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { TopTravelersComponent } from './components/home/top-travelers/top-travelers.component';
import { LocalGuidesViewComponent } from './components/local-guides-view/local-guides-view.component';
import { MessageComponent } from './components/message/message.component';
import { PhotoGalleryComponent } from './components/photo-gallery/photo-gallery.component';
import { PhotoUploadModalComponent } from './components/modals/photo-upload-modal/photo-upload-modal.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
   return new TranslateHttpLoader(httpClient);
}

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      SignInComponent,
      SearchComponent,
      NavigationComponent,
      TopToursViewComponent,
      FooterComponent,
      TourCreationComponent,
      SightseeingViewComponent,
      MyToursViewComponent,
      TruncatePipe,
      ConfirmationViewComponent,
      NotAuthorizedComponent,
      TourDetailViewComponent,
      ChatComponent,
      ImageUploadComponent,
      EditProfileViewComponent,
      DeleteProfileDialogComponent,
      PoiCreationComponent,
      TourDashboardComponent,
      StdDeleteModalComponent,
      PrivateChatComponent,
      EditTourComponent,
      ActiveToursComponent,
      PoiDetailViewComponent,
      LeaveTourCreationModalComponent,
      CommentBoxComponent,
      PoiEditComponent,
      SearchPipe,
      SearchPipePoi,
      PrivacyPolicyComponent,
      LikedToursComponent,
      ShareTourModalComponent,
      MyPoisViewComponent,
      TodoComponent,
      TourResultViewComponent,
      ProfileViewComponent,
      ContactFormComponent,
      ImpressumComponent,
      TopTravelersComponent,
      LocalGuidesViewComponent,
      MessageComponent,
      PhotoGalleryComponent,
      PhotoUploadModalComponent,
      ResetPasswordComponent,
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      AppBootstrapModule,
      GoogleMapsModule,
      FormsModule,
      MaterialModule,
      ReactiveFormsModule,
      HttpClientModule,
      GooglePlaceModule,
      DragDropModule,
      MatProgressSpinnerModule,
      MatIconModule,
      MatButtonModule,
      MatDialogModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MaterialFileInputModule,
      NgbModule,
      TranslateModule.forRoot({
         loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
         },
      }),
      GalleryModule,
      LightboxModule,
   ],
   providers: [
      AuthGuard,
      TourCreationGuard,
      ChatService,
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
   ],
   bootstrap: [AppComponent],
})
export class AppModule {}
