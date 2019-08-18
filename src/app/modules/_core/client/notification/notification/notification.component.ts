import {Component, OnInit} from '@angular/core';
import {Notification, UserProfile} from '@gw-models/core';
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
  notifications: Notification[];
  currentNotificationsPage: number;
  isLoadingSpinnerShown = true;
  notificationContentKeywords: string;
  nNotificationsPerPage: number;
  totalNotification: number;
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
  ngOnInit(): void {
    this.currentNotificationsPage = Config.currentPage;
    this.nNotificationsPerPage = Config.numberItemsPerPage;
    this.notificationContentKeywords = '';
    this.getSelectedUserProfile();
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile(): void {
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.getNotifications();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get notifications by current's page
   */
  private getNotifications(): void {
    const selectedUserProfileId = this.selectedUserProfile.id;
    const notificationStatus = 1;
    let getNotificationsUrl = `${Config.apiBaseUrl}/
${Config.apiNotificationManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiNotifications}?
${Config.pageParameter}=${this.currentNotificationsPage}&
${Config.statusParameter}=${notificationStatus}`;
    if (this.notificationContentKeywords.localeCompare('') !== 0) {
      getNotificationsUrl += `&${Config.searchParameter}=${this.notificationContentKeywords.toLowerCase()}`;
    }
    this.isLoadingSpinnerShown = true;
    this.notificationService.getNotifications(getNotificationsUrl)
      .subscribe(response => {
        this.notifications = response.body;
        this.totalNotification = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param event - selected page
   */
  public notificationsPageChange(event): void {
    this.currentNotificationsPage = event;
    this.getNotifications();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchNotifications(keyword): void {
    this.notificationContentKeywords = keyword;
    this.currentNotificationsPage = 1;
    this.getNotifications();
  }
}
