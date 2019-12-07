import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AddMembershipScheduleComponent,
  BuyingHistoryDetailComponent,
  ChatBotComponent,
  CoachTabsComponent,
  CoachDetailComponent,
  CoachScheduleDetailComponent,
  ExerciseDetailComponent,
  GalleryComponent,
  GiftComponent,
  HomeComponent,
  MembershipDetailComponent,
  MembershipScheduleDetailComponent,
  MusicComponent,
  NewFeedComponent,
  NotificationContainerComponent,
  PaymentAlertComponent,
  SingleExerciseComponent,
  SingleExerciseTrainingComponent,
  UserProfileComponent,
  VideoExerciseComponent,
  WorkoutComponent,
  WorkoutDetailComponent,
  WorkoutTrainingComponent
} from '@gw-client-module/components';
import { ForgotPasswordComponent } from '@gw-share-module/components';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'feed' },
      { path: 'gallery', component: GalleryComponent },
      { path: 'exercise', component: SingleExerciseComponent },
      { path: 'exercise/:slug', component: ExerciseDetailComponent },
      { path: 'workout', component: WorkoutComponent },
      { path: 'workout/:slug', component: WorkoutDetailComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'coach', component: CoachTabsComponent },
      { path: 'coach/detail', component: CoachDetailComponent },
      { path: 'membership/detail', component: MembershipDetailComponent },
      { path: 'membership/schedule/add', component: AddMembershipScheduleComponent },
      { path: 'membership/schedule/detail', component: MembershipScheduleDetailComponent },
      { path: 'coach/schedule/detail', component: CoachScheduleDetailComponent },
      { path: 'buying/history/detail', component: BuyingHistoryDetailComponent },
      { path: 'feed', component: NewFeedComponent },
      { path: 'notification', component: NotificationContainerComponent },
      { path: 'gift', component: GiftComponent },
      { path: 'music', component: MusicComponent },
      { path: 'chat-bot', component: ChatBotComponent }
    ]
  },
  {
    path: 'payment',
    component: PaymentAlertComponent
  },
  {
    path: 'exercise/tutorial/:slug',
    component: VideoExerciseComponent
  },
  {
    path: 'exercise/training/:slug',
    component: SingleExerciseTrainingComponent
  },
  {
    path: 'workout/training/:slug',
    component: WorkoutTrainingComponent
  },
  {
    path: 'change-password',
    component: ForgotPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule {
}
