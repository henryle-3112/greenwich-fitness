import {Component, OnInit} from '@angular/core';
import {Coach, CoachMembershipNotification, UserGift, UserProfile} from '@gw-models';
import {ShareUserProfileService} from '@gw-services/shared';
import {Router} from '@angular/router';
import {CoachMembershipNotificationService, CoachService, PaymentService, UserGiftService} from '@gw-services/api';
import {Config} from '@gw-config';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-training-notification',
  templateUrl: './training-notification.component.html',
  styleUrls: ['./training-notification.component.css']
})
export class TrainingNotificationComponent implements OnInit {
  currentTrainingNotificationsPage: number;
  isLoadingSpinnerShown = true;
  trainingNotificationContentKeywords: string;
  nNotificationsPerPage: number;
  totalTrainingNotifications: number;
  selectedUserProfile: UserProfile;
  // check current user is coach or normal user. If user is a coach, then get coach's information
  selectedCoach: Coach;
  coachMembershipNotifications: CoachMembershipNotification[];
  isVoucherModalShown: boolean;
  userGifts: UserGift[];
  currentUserGiftsPage: number;
  nUserGiftsPerPage: number;
  totalUserGifts: number;
  userGiftTitleKeywords: string;
  totalCoachPayment: number;
  selectedCoachMembershipNotification: CoachMembershipNotification;

  /**
   *
   * @param shareUserProfileService - inject shareUserProfileService
   * @param paymentService - inject shareUserProfileService
   * @param coachMembershipNotificationService - inject shareUserProfileService
   * @param coachService - inject shareUserProfileService
   * @param notification - inject shareUserProfileService
   * @param router - inject shareUserProfileService
   * @param userGiftService - inject userGiftService
   */
  constructor(private shareUserProfileService: ShareUserProfileService,
              private paymentService: PaymentService,
              private coachMembershipNotificationService: CoachMembershipNotificationService,
              private coachService: CoachService,
              private notification: NzNotificationService,
              private router: Router,
              private userGiftService: UserGiftService) {
  }

  ngOnInit(): void {
    this.totalCoachPayment = 20;
    this.currentUserGiftsPage = Config.currentPage;
    this.nUserGiftsPerPage = Config.numberItemsPerPage;
    this.userGiftTitleKeywords = '';
    this.userGifts = [];
    this.coachMembershipNotifications = [];
    this.currentTrainingNotificationsPage = Config.currentPage;
    this.nNotificationsPerPage = Config.numberItemsPerPage;
    this.trainingNotificationContentKeywords = '';
    this.totalTrainingNotifications = 0;
    this.getSelectedUserProfile();
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
   * show vocher modal
   */
  public showVoucherModal(selectedCoachMembershipNotification: CoachMembershipNotification) {
    this.selectedCoachMembershipNotification = selectedCoachMembershipNotification;
    this.getUserGifts();
  }

  /**
   * user gift
   */
  public useGift(selectedUserGift: UserGift) {
    switch (selectedUserGift.gift.point) {
      case 200:
        this.totalCoachPayment = (this.totalCoachPayment * 20) / 100;
        break;
      case 500:
        this.totalCoachPayment = (this.totalCoachPayment * 50) / 100;
        break;
      case 700:
        this.totalCoachPayment = (this.totalCoachPayment * 70) / 100;
        break;
    }
    this.isVoucherModalShown = false;
    this.paymentForCoach();
  }

  /**
   *
   * @param event - selected page
   */
  public userGiftsPageChange(event): void {
    this.currentUserGiftsPage = event;
    this.getUserGifts();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchUserGift(keyword): void {
    this.userGiftTitleKeywords = keyword;
    this.currentUserGiftsPage = 1;
    this.getUserGifts();
  }

  /**
   * handle cancel voucher modal
   */
  public handleCancelVoucherModal() {
    this.isVoucherModalShown = false;
  }

  /**
   * handle confirm voucher modal
   */
  public handleConfirmVoucherModal() {
    this.isVoucherModalShown = false;
  }

  /**
   * payment for coach
   */
  public paymentForCoach(): void {
    this.isLoadingSpinnerShown = true;
    const makePaymentUrl = `${Config.apiBaseUrl}/
${Config.apiPaypalManagementPrefix}/
${Config.apiMakePayment}?
${Config.sumParameter}=${this.totalCoachPayment}`;
    this.paymentService.makePayment(makePaymentUrl)
      .subscribe((response: any) => {
        if (response) {
          // set flag to check user use paypal to hire coach not buying products
          localStorage.setItem(Config.checkWhatUserWantToPay, 'coach');
          // save current user profile and current coach and current notification to localStorage just use for payment component
          // then delete after finishing
          localStorage.setItem(Config.currentCoachMembershipNotification, JSON.stringify(this.selectedCoachMembershipNotification));
          localStorage.setItem(Config.currentCoach, JSON.stringify(this.selectedCoachMembershipNotification.coach));
          localStorage.setItem(Config.currentUserProfile, JSON.stringify(this.selectedCoachMembershipNotification.userProfile));
          localStorage.setItem(Config.totalCoachPayment, JSON.stringify(this.totalCoachPayment));
          window.location.href = response.redirect_url;
        }
      });
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
        this.coachMembershipNotifications = response.body;
        this.totalTrainingNotifications = Number(response.headers.get(Config.headerXTotalCount));
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
        this.coachMembershipNotifications = response.body;
        this.totalTrainingNotifications += Number(response.headers.get(Config.headerXTotalCount));
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
   * get user's gifts by current's page
   */
  private getUserGifts(): void {
    const giftStatus = 0;
    const giftTypeId = 1;
    const selectedUserProfileId = this.selectedUserProfile.id;
    let getUserGiftsUrl = `${Config.apiBaseUrl}/
${Config.apiGiftManagementPrefix}/
${Config.apiUserGifts}?
${Config.userProfileIdParameter}=${selectedUserProfileId}&
${Config.statusParameter}=${giftStatus}&
${Config.giftTypeIdParameter}=${giftTypeId}&
${Config.pageParameter}=${this.currentUserGiftsPage}`;
    if (this.userGiftTitleKeywords.localeCompare('') !== 0) {
      getUserGiftsUrl += `&${Config.searchParameter}=${this.userGiftTitleKeywords.toLowerCase()}`;
    }
    this.isLoadingSpinnerShown = true;
    this.userGiftService.getUserGifts(getUserGiftsUrl)
      .subscribe(response => {
        this.userGifts = response.body;
        this.totalUserGifts = Number(response.headers.get(Config.headerXTotalCount));
        if (this.userGifts && this.userGifts.length > 0) {
          this.isVoucherModalShown = true;
          this.isLoadingSpinnerShown = false;
        } else {
          this.isLoadingSpinnerShown = false;
          this.paymentForCoach();
        }
      });
  }
}
