import {Component, OnInit} from '@angular/core';
import {Coach, CoachMembershipNotification, ResponseMessage, UserProfile} from '@gw-models/core';
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

  // currentPage
  currentPage = 1;

  // loading component is show ot not
  loading = true;

  // search value - return notifications and change pagination based on keywords
  searchValue: string;

  // number notifications per page
  nNotificationsPerPage: number;

  // total notifications
  totalNotifications: number;

  // selected user's profile
  selectedUserProfile: UserProfile;

  // check current user is coach or normal user. If user is a coach, then get coach's information
  selectedCoach: Coach;

  coachMembershipNotifications: CoachMembershipNotification[];

  constructor(private shareUserProfileService: ShareUserProfileService,
              private paymentService: PaymentService,
              private coachMembershipNotificationService: CoachMembershipNotificationService,
              private coachService: CoachService,
              private notification: NzNotificationService,
              private router: Router) {
  }

  ngOnInit() {
    // init current coach membership notifications
    this.coachMembershipNotifications = [];
    // init number of notifications per page
    this.nNotificationsPerPage = 8;
    // init current search value
    this.searchValue = '';
    // init total number of notifications
    this.totalNotifications = 0;
    // get selected user profile
    this.getSelectedUserProfile();
  }

  /**
   * get selected user profile
   */
  private getSelectedUserProfile() {
    // show loading component
    this.loading = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe((selectedUserProfile: UserProfile) => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          // check user is a coach or not. If user is a coach, then get coach's information
          this.getSelectedCoach();
        } else {
          this.router.navigate(['/client']);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get selected coach
   */
  private getSelectedCoach() {
    // show loading component
    this.loading = true;
    this.coachService.getCoachByUserProfile(this.selectedUserProfile, 1)
      .subscribe((selectedCoach: Coach) => {
        if (selectedCoach) {
          // user is a coach
          this.selectedCoach = selectedCoach;
          // get number of membership coach notifications based on coach and keyword
          this.getNumberOfCoachMembershipNotificationsByCoachIdAndByPageAndByKeyword();
          // get membership coach notification based on coach and keyword and page
          this.getCoachMembershipNotificationsByCoachIdAndByPageAndByKeyword();
        } else {
          // user is not a coach
          // get number of coach membership notifications based on user profile and keyword
          this.getNumberOfCoachMembershipNotificationsByUserProfileIdAndByPageAndByKeyword();
          // get membership coach notification based on user profile and keyword and page
          this.getCoachMembershipNotificationsByUserProfileIdAndByPageAndByKeyword();
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get number of coach membership notificatoins by coach and by keyword
   */
  private getNumberOfCoachMembershipNotificationsByCoachIdAndByPageAndByKeyword() {
    // show loading component
    this.loading = true;
    // create url to get total number of coach membership notifications by coach id and by keyword
    let currentGetNumberOfCoachMembershipNotificationsByCoachIdAndByKeyword =
      `${Config.api}/${Config.apiGetNumberOfCoachMembershipNotificationsByCoachIdAndByKeyword}/${this.selectedCoach.id}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetNumberOfCoachMembershipNotificationsByCoachIdAndByKeyword += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // get total number of coach membership notifications by coach id and by keyword
    this.coachMembershipNotificationService.getNumberOfCoachMembershipNotificationsByCoachIdAndByPageAndByKeyword(
      currentGetNumberOfCoachMembershipNotificationsByCoachIdAndByKeyword)
      .subscribe((nNotifications: ResponseMessage) => {
        if (nNotifications) {
          // assign total number of notifications
          this.totalNotifications = Number(nNotifications.message);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get notifications by coach id and by page and by keyword
   */
  private getCoachMembershipNotificationsByCoachIdAndByPageAndByKeyword() {
    // show loading component
    this.loading = true;
    // create url to get notifications by current page
    let currentGetNotificationsByCoachIdAndByPageAndByKeywordUrl =
      `${Config.api}/${Config.apiGetCoachMembershipNotificationsByCoachIdAndByKeywordAndByPage}
/${this.selectedCoach.id}/${this.currentPage}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetNotificationsByCoachIdAndByPageAndByKeywordUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // get notifications by page and keywords (if existed)
    this.coachMembershipNotificationService.getCoachMembershipNotificationsByCoachIdAndByPageAndByKeyword(
      currentGetNotificationsByCoachIdAndByPageAndByKeywordUrl)
      .subscribe((coachMembershipNotifications: CoachMembershipNotification[]) => {
        if (coachMembershipNotifications) {
          this.coachMembershipNotifications = [];
          // assign data to coach membership notifications
          this.coachMembershipNotifications = coachMembershipNotifications;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get coach membership notifications by user profile id and by page and by keyword
   */
  private getCoachMembershipNotificationsByUserProfileIdAndByPageAndByKeyword() {
    // show loading component
    this.loading = true;
    // create url to get notifications by current page
    let currentGetNotificationsByUserProfileIdAndByPageAndByKeywordUrl =
      `${Config.api}/${Config.apiGetCoachMembershipNotificationsByUserProfileIdAndByKeywordAndByPage}
/${this.selectedUserProfile.id}/${this.currentPage}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetNotificationsByUserProfileIdAndByPageAndByKeywordUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // get notifications by page and keywords (if existed)
    this.coachMembershipNotificationService.getCoachMembershipNotificationsByUserProfileIdAndByPageAndByKeyword(
      currentGetNotificationsByUserProfileIdAndByPageAndByKeywordUrl)
      .subscribe((coachMembershipNotifications: CoachMembershipNotification[]) => {
        if (coachMembershipNotifications) {
          this.coachMembershipNotifications = [];
          // assign data to coach membership notifications
          this.coachMembershipNotifications = coachMembershipNotifications;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get number fo coach membership notifications by user profile and by page and by keyword
   */
  private getNumberOfCoachMembershipNotificationsByUserProfileIdAndByPageAndByKeyword() {
    // show loading component
    this.loading = true;
    // create url to get total number of coach membership notifications by coach id and by keyword
    let currentGetNumberOfCoachMembershipNotificationsByUserProfileIdAndByKeyword =
      `${Config.api}/${Config.apiGetNumberOfCoachMembershipNotificationsByUserProfileIdAndByKeyword}/${this.selectedUserProfile.id}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetNumberOfCoachMembershipNotificationsByUserProfileIdAndByKeyword += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // get total number of coach membership notifications by coach id and by keyword
    this.coachMembershipNotificationService.getNumberOfCoachMembershipNotificationsByUserProfileIdAndByPageAndByKeyword(
      currentGetNumberOfCoachMembershipNotificationsByUserProfileIdAndByKeyword)
      .subscribe((nNotifications: ResponseMessage) => {
        if (nNotifications) {
          // assign total number of notifications
          this.totalNotifications = Number(nNotifications.message);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   *
   * @param event - current page
   */
  private notificationsPageChange(event) {
    // get current page
    this.currentPage = event;
    // reload data on page
    if (this.selectedCoach) {
      // if user is a coach
      this.getCoachMembershipNotificationsByCoachIdAndByPageAndByKeyword();
    } else {
      // if user is a normal user
      this.getCoachMembershipNotificationsByUserProfileIdAndByPageAndByKeyword();
    }
  }

  /**
   *
   * @param keyword - keyword
   */
  private searchNotifications(keyword) {
    // get search value
    this.searchValue = keyword;
    // restart current page
    this.currentPage = 1;
    // reload data
    if (this.selectedCoach) {
      this.getNumberOfCoachMembershipNotificationsByCoachIdAndByPageAndByKeyword();
      this.getCoachMembershipNotificationsByCoachIdAndByPageAndByKeyword();
    } else {
      this.getNumberOfCoachMembershipNotificationsByUserProfileIdAndByPageAndByKeyword();
      this.getCoachMembershipNotificationsByUserProfileIdAndByPageAndByKeyword();
    }
  }

  /**
   *
   * @param type - type of notification
   * @param title - title of notification
   * @param content - content of notification
   */
  createNotification(type: string, title: string, content: string) {
    this.notification.create(
      type,
      title,
      content
    );
  }

  /**
   * accept membership request
   */
  public acceptMembershipRequest(selectedCoachMembershipNotification: CoachMembershipNotification) {
    console.log('hello');
    // show loading component
    this.loading = true;
    selectedCoachMembershipNotification.status = 1;
    // update selected coach membership notification
    this.coachMembershipNotificationService.updateCoachMembershipNotification(selectedCoachMembershipNotification)
      .subscribe((updatedCoachMembershipNotificationService: CoachMembershipNotification) => {
        if (updatedCoachMembershipNotificationService) {
          // show success message to user
          this.createNotification('success', 'Success', 'Your request was handled successfully');
        } else {
          // show error message to user
          this.createNotification('error', 'Error', 'Failure to handle your request');
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * decline membership request
   */
  public declinedMembershipRequest(selectedCoachMembershipNotification: CoachMembershipNotification) {
    // show loading component
    this.loading = true;
    selectedCoachMembershipNotification.status = 0;
    // update selected coach membership notification
    this.coachMembershipNotificationService.updateCoachMembershipNotification(selectedCoachMembershipNotification)
      .subscribe((updatedCoachMembershipNotification: CoachMembershipNotification) => {
        if (updatedCoachMembershipNotification) {
          // show success message to user
          this.createNotification('success', 'Success', 'Your request was handled successfully');
        } else {
          // show error messaeg to user
          this.createNotification('error', 'Error', 'Failure to hand your request');
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * payment for coach
   */
  public paymentForCoach(selectedCoachMembershipNotification: CoachMembershipNotification) {
    // show loading component
    this.loading = true;
    // create payment
    const totalPayment = 20;
    this.paymentService.makePayment(totalPayment)
      .subscribe((response: any) => {
        if (response) {
          // set flag to check user use paypal to hire coach not buying products
          localStorage.setItem(Config.checkWhatUserWantToPay, 'coach');
          // save current user profile and current coach and current notification to localStorage just use for payment component
          // then delete after finishing
          localStorage.setItem(Config.currentCoachMembershipNotification, JSON.stringify(selectedCoachMembershipNotification));
          localStorage.setItem(Config.currentCoach, JSON.stringify(selectedCoachMembershipNotification.coach));
          localStorage.setItem(Config.currentUserProfile, JSON.stringify(selectedCoachMembershipNotification.userProfile));
          window.location.href = response.redirect_url;
        }
        // hide loading component
        this.loading = false;
      });
  }
}
