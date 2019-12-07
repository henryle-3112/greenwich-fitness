import {Component, OnInit} from '@angular/core';
import {Gift, UserGift, UserProfile} from '@gw-models';
import {Config} from '@gw-config';
import {GiftService, UserGiftService, UserProfileService} from '@gw-services/api';
import {ShareUserProfileService} from '@gw-services/shared';
import {Router} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-gift',
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.css']
})
export class GiftComponent implements OnInit {
  gifts: Gift[];
  currentGiftsPage: number;
  isLoadingSpinnerShown = true;
  giftTitleKeywords: string;
  nGiftPerPage: number;
  totalGifts: number;
  selectedUserProfile: UserProfile;

  /**
   *
   * @param giftService - inject giftService
   * @param shareUserProfileService - inject shareUserProfileService
   * @param router - inject router
   * @param notification - inject notification
   * @param userGiftService - inject userGiftService
   * @param userProfileService - inject userProfileService
   */
  constructor(private giftService: GiftService,
              private shareUserProfileService: ShareUserProfileService,
              private router: Router,
              private notification: NzNotificationService,
              private userGiftService: UserGiftService,
              private userProfileService: UserProfileService) {
  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.currentGiftsPage = Config.currentPage;
    this.nGiftPerPage = Config.numberItemsPerPage;
    this.giftTitleKeywords = '';
    this.getSelectedUserProfile();
  }

  /**
   *
   * @param event - selected page
   */
  public giftPageChange(event): void {
    this.currentGiftsPage = event;
    this.getGifts();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchGift(keyword): void {
    this.giftTitleKeywords = keyword;
    this.currentGiftsPage = 1;
    this.getGifts();
  }

  /**
   *
   * @param selectedGift - selected gift that user want to get
   */
  public getGift(selectedGift: Gift): void {
    if (this.selectedUserProfile.point < selectedGift.point) {
      this.createNotification('error', 'Error', 'You do have enough points to get this gift');
    } else {
      this.addUserGiftToServer(selectedGift);
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
   * get selected user's profile
   */
  private getSelectedUserProfile() {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.getGifts();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get gifts by current's page
   */
  private getGifts(): void {
    this.isLoadingSpinnerShown = true;
    let getGiftsUrl = `${Config.apiBaseUrl}/
${Config.apiGiftManagementPrefix}/
${Config.apiGifts}?
${Config.pageParameter}=${this.currentGiftsPage}`;
    if (this.giftTitleKeywords.localeCompare('') !== 0) {
      getGiftsUrl += `&${Config.searchParameter}=${this.giftTitleKeywords.toLowerCase()}`;
    }
    this.isLoadingSpinnerShown = true;
    this.giftService.getGifts(getGiftsUrl)
      .subscribe(response => {
        this.gifts = response.body;
        this.totalGifts = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param selectedGift - selected gift that user want to get
   */
  private addUserGiftToServer(selectedGift: Gift): void {
    this.isLoadingSpinnerShown = true;
    const userGift = new UserGift();
    userGift.status = 0;
    userGift.userProfile = this.selectedUserProfile;
    userGift.gift = selectedGift;
    const addUserGiftUrl = `${Config.apiBaseUrl}/${Config.apiGiftManagementPrefix}/${Config.apiUserGifts}`;
    this.userGiftService.addUserGift(addUserGiftUrl, userGift).subscribe((insertedUserGift: UserGift) => {
      if (insertedUserGift) {
        this.updateUserProfile(selectedGift);
      } else {
        this.createNotification('error', 'Error', `Cannot get ${selectedGift.name}! Please try again`);
      }
      this.isLoadingSpinnerShown = false;
    });
  }

  /**
   *
   * @param selectedGift - selected gift that user want to get
   */
  private updateUserProfile(selectedGift: Gift): void {
    this.isLoadingSpinnerShown = true;
    this.selectedUserProfile.point -= selectedGift.point;
    const updateUserProfileUrl = `${Config.apiBaseUrl}/${Config.apiUserManagementPrefix}/${Config.apiUserProfiles}`;
    this.userProfileService.updateUserProfile(updateUserProfileUrl, this.selectedUserProfile)
      .subscribe((updatedUserProfile: UserProfile) => {
        if (updatedUserProfile) {
          this.createNotification('success', 'Success', `Get ${selectedGift.name} successfully, You can check your gift in your profile`);
        } else {
          this.createNotification('error', 'Error', `Cannot get ${selectedGift.name}! Please try again`);
        }
        this.isLoadingSpinnerShown = false;
      });
  }


}
