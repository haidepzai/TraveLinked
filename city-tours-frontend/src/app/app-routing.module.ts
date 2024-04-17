import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ProfileViewComponent } from './components/profile-view/profile-view.component';
import { TourResultViewComponent } from './components/tour-result-view/tour-result-view.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { EditTourComponent } from './components/Tours/edit-tour/edit-tour.component';
import { TourCreationGuard } from './guards/tour-creation.guard';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { AuthGuard } from './guards/auth.guard';
import { ConfirmationViewComponent } from './components/confirmation-view/confirmation-view.component';
import { SightseeingViewComponent } from './components/sightseeing-view/sightseeing-view.component';
import { TopToursViewComponent } from './components/home/top-tours-view/top-tours-view.component';
import { HomeComponent } from './components/home/home.component';
import { MyToursViewComponent } from './components/tour-dashboard/my-tours-view/my-tours-view.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TourCreationComponent } from './components/Tours/tour-creation/tour-creation.component';
import { TourDetailViewComponent } from './components/Tours/tour-detail-view/tour-detail-view.component';
import { ChatComponent } from './components/chat/chat.component';
import { EditProfileViewComponent } from './components/profile-view/edit-profile-view/edit-profile-view/edit-profile-view.component';
import { PoiCreationComponent } from './components/PointsOfInterests/poi-creation/poi-creation.component';
import { TourDashboardComponent } from './components/tour-dashboard/tour-dashboard.component';
import { PrivateChatComponent } from './components/chat/private-chat/private-chat.component';
import { PoiDetailViewComponent } from './components/PointsOfInterests/poi-detail-view/poi-detail-view.component';
import { PoiEditComponent } from './components/PointsOfInterests/poi-edit/poi-edit.component';
import { LikedToursComponent } from './components/tour-dashboard/liked-tours/liked-tours.component';
import { MyPoisViewComponent } from './components/tour-dashboard/my-pois-view/my-pois-view.component';
import { LocalGuidesViewComponent } from './components/local-guides-view/local-guides-view.component';

const routes: Routes = [
   {
      path: '',
      component: HomeComponent,
      children: [
         { path: '', component: TopToursViewComponent },
         { path: 'poi', component: SightseeingViewComponent },
         { path: 'tours-view', component: TourResultViewComponent },
         { path: 'local-guides', component: LocalGuidesViewComponent },
      ],
   },
   {
      path: 'tour-dashboard',
      component: TourDashboardComponent,
      canActivate: [AuthGuard],
      children: [
         { path: 'my-tours', component: MyToursViewComponent },
         { path: 'liked-tours', component: LikedToursComponent },
         { path: 'my-pois', component: MyPoisViewComponent },
      ],
   },
   {
      path: 'tour-creation',
      component: TourCreationComponent,
      canActivate: [AuthGuard],
      canDeactivate: [TourCreationGuard],
   },
   { path: 'poi-creation', component: PoiCreationComponent, canActivate: [AuthGuard] },
   { path: 'poi-detail-view/:poiid', component: PoiDetailViewComponent },
   { path: 'poi-edit/:poiid', component: PoiEditComponent },
   { path: 'not-authorized', component: NotAuthorizedComponent },
   { path: 'tour-detail-view/:tourid', component: TourDetailViewComponent },
   { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
   { path: 'edit-profile', component: EditProfileViewComponent, canActivate: [AuthGuard] },
   { path: 'confirm/:confirmationcode', component: ConfirmationViewComponent },
   { path: 'private-chat', component: PrivateChatComponent, canActivate: [AuthGuard] },
   { path: 'edit-tour/:tourid', component: EditTourComponent, canActivate: [AuthGuard] },
   { path: 'privacy-policy', component: PrivacyPolicyComponent },
   { path: 'profile-view/:userid', component: ProfileViewComponent },
   { path: 'resetpassword/:resetpasswordcode', component: ResetPasswordComponent },
];

@NgModule({
   imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
   exports: [RouterModule],
})
export class AppRoutingModule {}
