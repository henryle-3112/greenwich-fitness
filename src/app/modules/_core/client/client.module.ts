import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgZorroAntdModule} from 'ng-zorro-antd';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ClientRoutingModule} from './client-routing.module';

import {
  AddMembershipScheduleComponent,
  BodyIndexReportComponent,
  BuyingHistoryComponent,
  BuyingHistoryDetailComponent,
  ChatBotComponent,
  CoachAchievementComponent,
  CoachChatComponent,
  CoachTabsComponent,
  CoachComponent,
  RecommendedCoachesComponent,
  CoachDetailComponent,
  CoachInformationComponent,
  CoachMembershipComponent,
  CoachPaymentHistoryComponent,
  CoachScheduleComponent,
  CoachScheduleDetailComponent,
  ExerciseDetailComponent,
  GalleryComponent,
  GiftComponent,
  HomeComponent,
  MembershipAchievementComponent,
  MembershipBodyIndexReportComponent,
  MembershipChatComponent,
  MembershipDetailComponent,
  MembershipScheduleComponent,
  MembershipScheduleDetailComponent,
  MusicComponent,
  NewFeedComponent,
  NotificationComponent,
  NotificationContainerComponent,
  PaymentAlertComponent,
  RevenueComponent,
  SingleExerciseComponent,
  SingleExerciseTrainingComponent,
  TrainingNotificationComponent,
  UserAchievementComponent,
  UserCoachComponent,
  UserGiftComponent,
  UserInformationComponent,
  UserProfileComponent,
  VideoExerciseComponent,
  WorkoutComponent,
  WorkoutDetailComponent,
  WorkoutTrainingComponent
} from '@gw-client-module/components';
import {ShareModule} from '@gw-share-module';

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
    ChatBotComponent,
    CoachTabsComponent,
    RecommendedCoachesComponent
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
