import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ExerciseDetailComponent } from './exercises/exercise-detail/exercise-detail.component';
import { VideoExerciseComponent } from './exercises/video-exercise/video-exercise.component';
import { SingleExerciseTrainingComponent } from './exercises/single-exercise-training/single-exercise-training.component';
import { GalleryComponent } from './gallery/gallery.component';
import { SingleExerciseComponent } from './exercises/single-exercise/single-exercise.component';
import { WorkoutComponent } from './workouts/workout/workout.component';
import { WorkoutDetailComponent } from './workouts/workout-detail/workout-detail.component';
import { WorkoutTrainingComponent } from './workouts/workout-training/workout-training.component';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { ForgotPasswordComponent } from '../../../../share/forgot-password/forgot-password.component';
import { MusicComponent } from './music/music.component';
import { CoachComponent } from './coaches/coach/coach.component';
import { CoachDetailComponent } from './coaches/coach-detail/coach-detail.component';
import { MembershipDetailComponent } from './memberships/membership-detail/membership-detail.component';
import { MembershipScheduleDetailComponent } from './memberships/membership-schedule-detail/membership-schedule-detail.component';
import { AddMembershipScheduleComponent } from './memberships/add-membership-schedule/add-membership-schedule.component';
import { CoachScheduleDetailComponent } from './coaches/coach-schedule-detail/coach-schedule-detail.component';
import { NewFeedComponent } from './new-feed/new-feed.component';
import { PaymentAlertComponent } from './payment-alert/payment-alert.component';
import { BuyingHistoryDetailComponent } from './profile/buying-history-detail/buying-history-detail.component';
import { NotificationContainerComponent } from './notification/notification-container/notification-container.component';
import { GiftComponent } from './gift/gift/gift.component';

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
      {
        path: 'music',
        component: MusicComponent
      }
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
