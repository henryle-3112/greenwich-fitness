import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomeComponent } from '@gw-modules/core/client/home/home.component';

import { GalleryComponent } from '@gw-modules/core/client/gallery/gallery.component';

import { SingleExerciseComponent } from '@gw-modules/core/client/exercises/single-exercise/single-exercise.component';
import { ExerciseDetailComponent } from '@gw-modules/core/client/exercises/exercise-detail/exercise-detail.component';
import { VideoExerciseComponent } from '@gw-modules/core/client/exercises/video-exercise/video-exercise.component';
// tslint:disable-next-line:max-line-length
import { SingleExerciseTrainingComponent } from '@gw-modules/core/client/exercises/single-exercise-training/single-exercise-training.component';

import { WorkoutComponent } from '@gw-modules/core/client/workouts/workout/workout.component';
import { WorkoutDetailComponent } from '@gw-modules/core/client/workouts/workout-detail/workout-detail.component';
import { WorkoutTrainingComponent } from '@gw-modules/core/client/workouts/workout-training/workout-training.component';

import { UserProfileComponent } from '@gw-modules/core/client/profile/user-profile/user-profile.component';
import { BuyingHistoryDetailComponent } from '@gw-modules/core/client/profile/buying-history-detail/buying-history-detail.component';

import { MusicComponent } from '@gw-modules/core/client/music/music.component';

import { CoachComponent } from '@gw-modules/core/client/coaches/coach/coach.component';
import { CoachDetailComponent } from '@gw-modules/core/client/coaches/coach-detail/coach-detail.component';
import { CoachScheduleDetailComponent } from '@gw-modules/core/client/coaches/coach-schedule-detail/coach-schedule-detail.component';

import { MembershipDetailComponent } from '@gw-modules/core/client/memberships/membership-detail/membership-detail.component';
// tslint:disable-next-line:max-line-length
import { MembershipScheduleDetailComponent } from '@gw-modules/core/client/memberships/membership-schedule-detail/membership-schedule-detail.component';
// tslint:disable-next-line:max-line-length
import { AddMembershipScheduleComponent } from '@gw-modules/core/client/memberships/add-membership-schedule/add-membership-schedule.component';

import { NewFeedComponent } from '@gw-modules/core/client/new-feed/new-feed.component';

import { PaymentAlertComponent } from '@gw-modules/core/client/payment-alert/payment-alert.component';

// tslint:disable-next-line:max-line-length
import { NotificationContainerComponent } from '@gw-modules/core/client/notification/notification-container/notification-container.component';

import { GiftComponent } from '@gw-modules/core/client/gift/gift/gift.component';

import { ChatBotComponent } from '@gw-modules/core/client/chat-bot/chat-bot.component';
import { ForgotPasswordComponent } from '@gw-share-module/core/forgot-password/forgot-password.component';


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
      { path: 'coach', component: CoachComponent },
      { path: 'coach/detail', component: CoachDetailComponent },
      { path: 'membership/detail', component: MembershipDetailComponent },
      { path: 'membership/schedule/add', component: AddMembershipScheduleComponent },
      { path: 'membership/schedule/detail', component: MembershipScheduleDetailComponent },
      { path: 'coach/schedule/detail', component: CoachScheduleDetailComponent },
      { path: 'buying/history/detail', component: BuyingHistoryDetailComponent },
      { path: 'feed', component: NewFeedComponent },
      { path: 'notification', component: NotificationContainerComponent },
      { path: 'gift', component: GiftComponent },
      { path: 'music', component: MusicComponent},
      { path: 'chat-bot', component: ChatBotComponent}
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
