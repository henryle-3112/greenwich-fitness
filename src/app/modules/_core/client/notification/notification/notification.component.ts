import {Component, OnInit} from '@angular/core';
import {Notification, ResponseMessage, UserProfile} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {NotificationService} from '@gw-services/core/api/notification/notification.service';
import {Router} from '@angular/router';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  // list of notifications
  notifications: Notification[];

  // currentPage
  currentPage = 1;

  // loading component is show ot not
  loading = true;

  // search value - return notifications and change pagination based on keywords
  searchValue: string;

  // number notification per page
  nNotificationsPerPage: number;

  // total notification
  totalNotification: number;

  // selected user profile
  selectedUserProfile: UserProfile;

  /**
   *
   * @param notificationService - inject notificationService
   * @param router - inject router
   * @param shareUserProfileService - inject shareUserProfileService
   */
  constructor(private notificationService: NotificationService,
              private router: Router,
              private shareUserProfileService: ShareUserProfileService) {
  }

  /**
   * init data
   */
  ngOnInit() {
    // init number of notifications per page
    this.nNotificationsPerPage = 8;
    // init current search value
    this.searchValue = '';
    // get selected user's profile
    this.getSelectedUserProfile();
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile() {
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          // get total number of notifications
          this.getNumberOfNotifications();
          // get notifications by page
          this.getNotificationsByPage();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get notifications by current's page
   */
  private getNotificationsByPage() {
    // create url to get notifications by current page
    let getNotificationsByPageUrl = `${Config.api}/
${Config.apiGetNotificationsByUserProfileIdAndByPage}/
${this.selectedUserProfile.id}/${this.currentPage}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      getNotificationsByPageUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // show loading component
    this.loading = true;
    // get notifications by page and keywords (if existed)
    this.notificationService.getNotificationsByUserProfileIdAndByPage(getNotificationsByPageUrl)
      .subscribe((response: Notification[]) => {
        if (response) {
          this.notifications = [];
          // assign data to notifications
          this.notifications = response;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   *
   * @param event - selected page
   */
  public notificationsPageChange(event) {
    // get current's page
    this.currentPage = event;
    // get notifications by page
    this.getNotificationsByPage();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchNotifications(keyword) {
    // set current search keyword - user-account search notifications by name and change pagination based on keyword
    this.searchValue = keyword;
    // reset current page
    this.currentPage = 1;
    // change pagination
    this.getNumberOfNotifications();
    this.getNotificationsByPage();
  }

  /**
   * get total number of notifications
   */
  private getNumberOfNotifications() {
    // create url to get total number of notifications
    let currentGetNumberOfNotificationsUrl = `${Config.api}/${Config.apiCountNotificationsByUserProfileId}/${this.selectedUserProfile.id}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetNumberOfNotificationsUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // showing loading component
    this.loading = true;
    // get total number of notifications
    this.notificationService.getNumberOfNotificationsByUserProfileId(currentGetNumberOfNotificationsUrl)
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage) {
          // assign total number of galleries to total notifications
          this.totalNotification = Number(responseMessage.message);
        }
      });
  }
}
