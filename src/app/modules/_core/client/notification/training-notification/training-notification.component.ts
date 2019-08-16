import {Component, OnInit} from '@angular/core';
import {Coach, CoachMembershipNotification, UserProfile} from '@gw-models/core';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {Router} from '@angular/router';
import {CoachService} from '@gw-services/core/api/coach/coach.service';
import {Config} from '@gw-config/core';
import {CoachMembershipNotificationService} from '@gw-services/core/api/notification/coach-membership-notification.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {PaymentService} from '@gw-services/core/api/payment/payment.service';

@Component({
  selector: 'app-training-notification',
  templateUrl: './training-notification.component.html',
  styleUrls: ['./training-notification.component.css']
})
export class TrainingNotificationComponent implements OnInit {
  currentTrainingNotificationsPage = 1;
  isLoadingSpinnerShown = true;
  trainingNotificationContentKeywords: string;
  nNotificationsPerPage: number;
  totalTrainingNotifications: number;
  selectedUserProfile: UserProfile;
  // check current user is coach or normal user. If user is a coach, then get coach's information
  selectedCoach: Coach;
  coachMembershipNotifications: CoachMembershipNotification[];

  /**
   *
   * @param shareUserProfileService - inject shareUserProfileService
   * @param paymentService - inject shareUserProfileService
   * @param coachMembershipNotificationService - inject shareUserProfileService
   * @param coachService - inject shareUserProfileService
   * @param notification - inject shareUserProfileService
   * @param router - inject shareUserProfileService
   */
  constructor(private shareUserProfileService: ShareUserProfileService,
              private paymentService: PaymentService,
              private coachMembershipNotificationService: CoachMembershipNotificationService,
              private coachService: CoachService,
              private notification: NzNotificationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.coachMembershipNotifications = [];
    this.nNotificationsPerPage = 8;
    this.trainingNotificationContentKeywords = '';
    this.totalTrainingNotifications = 0;
    this.getSelectedUserProfile();
  }

  /**
   * get selected user profile
   */
  private getSelectedUserProfile(): void {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe((selectedUserProfile: UserProfile) => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.getSelectedCoach();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get selected coach
   */
  private getSelectedCoach(): void {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = this.selectedUserProfile.id;
    const coachStatus = 1;
    const getCoachUrl = `${Config.apiBaseUrl}/
${Config.apiCoachManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiCoaches}?
${Config.statusParameter}=${coachStatus}`;
    this.coachService.getCoach(getCoachUrl)
      .subscribe((selectedCoach: Coach) => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          this.getTrainingNotificationsForCoach();
        } else {
          this.getTrainingNotificationsForUser();
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get notifications by coach id and by page and by keyword
   */
  private getTrainingNotificationsForCoach(): void {
    this.isLoadingSpinnerShown = true;
    const selectedCoachId = this.selectedCoach.id;
    let getTrainingNotificationsUrl = `${Config.apiBaseUrl}/
${Config.apiNotificationManagementPrefix}/
${Config.apiCoaches}/
${selectedCoachId}/
${Config.apiCoachMembershipNotifications}?
${Config.pageParameter}=${this.currentTrainingNotificationsPage}`;
    if (this.trainingNotificationContentKeywords.localeCompare('') !== 0) {
      getTrainingNotificationsUrl += `&${Config.searchParameter}=${this.trainingNotificationContentKeywords.toLowerCase()}`;
    }
    // get notifications by page and keywords (if existed)
    this.coachMembershipNotificationService.getCoachMembershipNotifications(getTrainingNotificationsUrl)
      .subscribe(response => {
        // if (coachMembershipNotifications) {
        //   this.coachMembershipNotifications = [];
        //   // assign data to coach membership notifications
        //   this.coachMembershipNotifications = coachMembershipNotifications;
        // }
        console.log(response);
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get coach membership notifications by user profile id and by page and by keyword
   */
  private getTrainingNotificationsForUser(): void {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = this.selectedUserProfile.id;
    let getTrainingNotificationsUrl = `${Config.apiBaseUrl}/
${Config.apiNotificationManagementPrefix}/
${Config.apiUsers}/${selectedUserProfileId}/
${Config.apiCoachMembershipNotifications}?
${Config.pageParameter}=${this.currentTrainingNotificationsPage}`;
    if (this.trainingNotificationContentKeywords.localeCompare('') !== 0) {
      getTrainingNotificationsUrl += `&${Config.searchParameter}=${this.trainingNotificationContentKeywords.toLowerCase()}`;
    }
    // get notifications by page and keywords (if existed)
    this.coachMembershipNotificationService.getCoachMembershipNotifications(getTrainingNotificationsUrl)
      .subscribe(response => {
        // if (coachMembershipNotifications) {
        //   this.coachMembershipNotifications = [];
        //   this.coachMembershipNotifications = coachMembershipNotifications;
        // }
        console.log(response);
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param event - current page
   */
  private notificationsPageChange(event): void {
    this.currentTrainingNotificationsPage = event;
    if (this.selectedCoach) {
      this.getTrainingNotificationsForCoach();
    } else {
      this.getTrainingNotificationsForUser();
    }
  }

  /**
   *
   * @param keyword - keyword that will be used to filter list of training's notifications
   */
  private searchNotifications(keyword): void {
    this.trainingNotificationContentKeywords = keyword;
    this.currentTrainingNotificationsPage = 1;
    if (this.selectedCoach) {
      this.getTrainingNotificationsForCoach();
    } else {
      this.getTrainingNotificationsForUser();
    }
  }

  /**
   *
   * @param type - type of notification
   * @param title - title of notification
   * @param content - content of notification
   */
  createNotification(type: string, title: string, content: string): void {
    this.notification.create(
      type,
      title,
      content
    );
  }

  /**
   *
   * @param selectedCoachMembershipNotification - training's notification that coach want to accept
   */
  public acceptMembershipRequest(selectedCoachMembershipNotification: CoachMembershipNotification): void {
    this.isLoadingSpinnerShown = true;
    selectedCoachMembershipNotification.status = 1;
    const updateTrainingNotificationUrl = `${Config.apiBaseUrl}/
${Config.apiNotificationManagementPrefix}/
${Config.apiCoachMembershipNotifications}`;
    this.coachMembershipNotificationService
      .updateCoachMembershipNotification(updateTrainingNotificationUrl, selectedCoachMembershipNotification)
      .subscribe((updatedCoachMembershipNotificationService: CoachMembershipNotification) => {
        if (updatedCoachMembershipNotificationService) {
          this.createNotification('success', 'Success', 'Your request was handled successfully');
        } else {
          this.createNotification('error', 'Error', 'Failure to handle your request');
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param selectedCoachMembershipNotification - training's notification that coach want to decline
   */
  public declinedMembershipRequest(selectedCoachMembershipNotification: CoachMembershipNotification): void {
    this.isLoadingSpinnerShown = true;
    selectedCoachMembershipNotification.status = 0;
    const updateTrainingNotificationUrl = `${Config.apiBaseUrl}/
${Config.apiNotificationManagementPrefix}/
${Config.apiCoachMembershipNotifications}`;
    this.coachMembershipNotificationService
      .updateCoachMembershipNotification(updateTrainingNotificationUrl, selectedCoachMembershipNotification)
      .subscribe((updatedCoachMembershipNotification: CoachMembershipNotification) => {
        if (updatedCoachMembershipNotification) {
          this.createNotification('success', 'Success', 'Your request was handled successfully');
        } else {
          this.createNotification('error', 'Error', 'Failure to hand your request');
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param selectedCoachMembershipNotification - training's notification that user want to make payment
   */
  public paymentForCoach(selectedCoachMembershipNotification: CoachMembershipNotification): void {
    this.isLoadingSpinnerShown = true;
    const totalPayment = 20;
    const makePaymentUrl = `${Config.apiBaseUrl}/
${Config.apiPaypalManagementPrefix}/
${Config.apiMakePayment}?
${Config.sumParameter}=${totalPayment}`;
    this.paymentService.makePayment(makePaymentUrl)
      .subscribe((response: any) => {
        if (response) {
          // set flag to check user use paypal to hire coach not buying products
          localStorage.setItem(Config.checkWhatUserWantToPay, 'coach');
          // save current user profile and current coach and current notification to localStorage just use for payment component
          // then delete after finishing
          localStorage.setItem(Config.currentCoachMembershipNotification, JSON.stringify(selectedCoachMembershipNotification));
          localStorage.setItem(Config.currentCoach, JSON.stringify(selectedCoachMembershipNotification.coach));
          localStorage.setItem(Config.currentUserProfile, JSON.stringify(selectedCoachMembershipNotification.userProfile));
          localStorage.setItem(Config.totalCoachPayment, JSON.stringify(totalPayment));
          window.location.href = response.redirect_url;
        }
        this.isLoadingSpinnerShown = false;
      });
  }
}
