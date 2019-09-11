import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgZorroAntdModule } from 'ng-zorro-antd';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientRoutingModule } from './client-routing.module';

import { ShareModule } from '@gw-share-module/core/share.module';

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
import { UserInformationComponent } from '@gw-modules/core/client/profile/user-information/user-information.component';
import { BodyIndexReportComponent } from '@gw-modules/core/client/profile/body-index-report/body-index-report.component';
import { UserAchievementComponent } from '@gw-modules/core/client/profile/user-achievement/user-achievement.component';
import { BuyingHistoryComponent } from '@gw-modules/core/client/profile/buying-history/buying-history.component';
import { CoachMembershipComponent } from '@gw-modules/core/client/profile/coach-membership/coach-membership.component';
import { UserCoachComponent } from '@gw-modules/core/client/profile/user-coach/user-coach.component';
import { BuyingHistoryDetailComponent } from '@gw-modules/core/client/profile/buying-history-detail/buying-history-detail.component';
import { RevenueComponent } from '@gw-modules/core/client/profile/revenue/revenue.component';
import { CoachPaymentHistoryComponent } from '@gw-modules/core/client/profile/coach-payment-history/coach-payment-history.component';
import { UserGiftComponent } from '@gw-modules/core/client/profile/user-gift/user-gift.component';

import { MusicComponent } from '@gw-modules/core/client/music/music.component';

import { CoachComponent } from '@gw-modules/core/client/coaches/coach/coach.component';
import { CoachDetailComponent } from '@gw-modules/core/client/coaches/coach-detail/coach-detail.component';
import { CoachAchievementComponent } from '@gw-modules/core/client/coaches/coach-achievement/coach-achievement.component';
import { CoachInformationComponent } from '@gw-modules/core/client/coaches/coach-information/coach-information.component';
import { CoachScheduleComponent } from '@gw-modules/core/client/coaches/coach-schedule/coach-schedule.component';
import { CoachScheduleDetailComponent } from '@gw-modules/core/client/coaches/coach-schedule-detail/coach-schedule-detail.component';
import { CoachChatComponent } from '@gw-modules/core/client/coaches/coach-chat/coach-chat.component';

import { MembershipDetailComponent } from '@gw-modules/core/client/memberships/membership-detail/membership-detail.component';
import { MembershipScheduleComponent } from '@gw-modules/core/client/memberships/membership-schedule/membership-schedule.component';
// tslint:disable-next-line:max-line-length
import { MembershipAchievementComponent } from '@gw-modules/core/client/memberships/membership-achievement/membership-achievement.component';
// tslint:disable-next-line:max-line-length
import { MembershipBodyIndexReportComponent } from '@gw-modules/core/client/memberships/membership-body-index-report/membership-body-index-report.component';
// tslint:disable-next-line:max-line-length
import { MembershipScheduleDetailComponent } from '@gw-modules/core/client/memberships/membership-schedule-detail/membership-schedule-detail.component';
// tslint:disable-next-line:max-line-length
import { AddMembershipScheduleComponent } from '@gw-modules/core/client/memberships/add-membership-schedule/add-membership-schedule.component';
import { MembershipChatComponent } from '@gw-modules/core/client/memberships/membership-chat/membership-chat.component';

import { NewFeedComponent } from '@gw-modules/core/client/new-feed/new-feed.component';

import { PaymentAlertComponent } from '@gw-modules/core/client/payment-alert/payment-alert.component';

import { TrainingNotificationComponent } from '@gw-modules/core/client/notification/training-notification/training-notification.component';
import { NotificationComponent } from '@gw-modules/core/client/notification/notification/notification.component';
// tslint:disable-next-line:max-line-length
import { NotificationContainerComponent } from '@gw-modules/core/client/notification/notification-container/notification-container.component';

import { GiftComponent } from '@gw-modules/core/client/gift/gift/gift.component';

import { ChatBotComponent } from '@gw-modules/core/client/chat-bot/chat-bot.component';


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
    NotificationContainerComponent,
    GiftComponent,
    UserGiftComponent,
    CoachChatComponent,
    MembershipChatComponent,
    ChatBotComponent
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
