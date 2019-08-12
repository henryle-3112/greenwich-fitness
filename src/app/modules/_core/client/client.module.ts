import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgZorroAntdModule} from 'ng-zorro-antd';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ClientRoutingModule} from './client-routing.module';
import {HomeComponent} from './home/home.component';
import {ExerciseDetailComponent} from './exercises/exercise-detail/exercise-detail.component';
import {VideoExerciseComponent} from './exercises/video-exercise/video-exercise.component';
import {SingleExerciseTrainingComponent} from './exercises/single-exercise-training/single-exercise-training.component';
import {GalleryComponent} from './gallery/gallery.component';
import {SingleExerciseComponent} from './exercises/single-exercise/single-exercise.component';
import {WorkoutComponent} from './workouts/workout/workout.component';
import {WorkoutDetailComponent} from './workouts/workout-detail/workout-detail.component';
import {WorkoutTrainingComponent} from './workouts/workout-training/workout-training.component';
import {UserProfileComponent} from './profile/user-profile/user-profile.component';
import {UserInformationComponent} from './profile/user-information/user-information.component';
import {BodyIndexReportComponent} from './profile/body-index-report/body-index-report.component';
import {UserAchievementComponent} from './profile/user-achievement/user-achievement.component';
import {BuyingHistoryComponent} from './profile/buying-history/buying-history.component';
import {ShareModule} from '../../../../share/share.module';
import {MusicComponent} from './music/music.component';
import {CoachComponent} from './coaches/coach/coach.component';
import {CoachDetailComponent} from './coaches/coach-detail/coach-detail.component';
import {CoachAchievementComponent} from './coaches/coach-achievement/coach-achievement.component';
import {CoachInformationComponent} from './coaches/coach-information/coach-information.component';
import {CoachMembershipComponent} from './profile/coach-membership/coach-membership.component';
import {MembershipDetailComponent} from './memberships/membership-detail/membership-detail.component';
import {MembershipScheduleComponent} from './memberships/membership-schedule/membership-schedule.component';
import {MembershipAchievementComponent} from './memberships/membership-achievement/membership-achievement.component';
import {MembershipBodyIndexReportComponent} from './memberships/membership-body-index-report/membership-body-index-report.component';
import { UserCoachComponent } from './profile/user-coach/user-coach.component';
import { MembershipScheduleDetailComponent } from './memberships/membership-schedule-detail/membership-schedule-detail.component';
import { AddMembershipScheduleComponent } from './memberships/add-membership-schedule/add-membership-schedule.component';
import { CoachScheduleComponent } from './coaches/coach-schedule/coach-schedule.component';
import { CoachScheduleDetailComponent } from './coaches/coach-schedule-detail/coach-schedule-detail.component';
import { NewFeedComponent } from './new-feed/new-feed.component';
import { PaymentAlertComponent } from './payment-alert/payment-alert.component';
import { BuyingHistoryDetailComponent } from './profile/buying-history-detail/buying-history-detail.component';
import { TrainingNotificationComponent } from './notification/training-notification/training-notification.component';
import { NotificationComponent } from './notification/notification/notification.component';
import { RevenueComponent } from './profile/revenue/revenue.component';
import { CoachPaymentHistoryComponent } from './profile/coach-payment-history/coach-payment-history.component';
import { NotificationContainerComponent } from './notification/notification-container/notification-container.component';

@NgModule({
  declarations: [
    HomeComponent,
    GalleryComponent,
    SingleExerciseComponent,
    ExerciseDetailComponent,
    VideoExerciseComponent,
    SingleExerciseTrainingComponent,
    WorkoutComponent,
    WorkoutDetailComponent,
    WorkoutTrainingComponent,
    UserProfileComponent,
    UserInformationComponent,
    BodyIndexReportComponent,
    UserAchievementComponent,
    BuyingHistoryComponent,
    MusicComponent,
    CoachComponent,
    CoachDetailComponent,
    CoachAchievementComponent,
    CoachInformationComponent,
    CoachMembershipComponent,
    MembershipDetailComponent,
    MembershipScheduleComponent,
    MembershipAchievementComponent,
    MembershipBodyIndexReportComponent,
    UserCoachComponent,
    MembershipScheduleDetailComponent,
    AddMembershipScheduleComponent,
    CoachScheduleComponent,
    CoachScheduleDetailComponent,
    NewFeedComponent,
    PaymentAlertComponent,
    BuyingHistoryDetailComponent,
    TrainingNotificationComponent,
    NotificationComponent,
    RevenueComponent,
    CoachPaymentHistoryComponent,
    NotificationContainerComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    ShareModule
  ]
})
// export ClientModule
export class ClientModule {
}
