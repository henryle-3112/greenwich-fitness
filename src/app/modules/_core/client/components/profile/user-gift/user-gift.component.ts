import {Component, OnInit} from '@angular/core';
import {UserGift, UserProfile} from '@gw-models';
import {Config} from '@gw-config';
import {ShareUserProfileService} from '@gw-services/shared';
import {Router} from '@angular/router';
import {UserGiftService} from '@gw-services/api';

@Component({
  selector: 'app-user-gift',
  templateUrl: './user-gift.component.html',
  styleUrls: ['./user-gift.component.css']
})
export class UserGiftComponent implements OnInit {

  userGifts: UserGift[];
  currentUserGiftsPage: number;
  isLoadingSpinnerShown = true;
  userGiftTitleKeywords: string;
  nUserGiftsPerPage: number;
  totalUserGifts: number;
  selectedUserProfile: UserProfile;

  /**
   *
   * @param userGiftService - inject userGiftService
   * @param shareUserProfileService - inject shareUserProfileService
   * @param router - inject router
   */
  constructor(private userGiftService: UserGiftService,
              private shareUserProfileService: ShareUserProfileService,
              private router: Router) {
  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.currentUserGiftsPage = Config.currentPage;
    this.nUserGiftsPerPage = Config.numberItemsPerPage;
    this.userGiftTitleKeywords = '';
    this.getSelectedUserProfile();
    this.getUserGifts();
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
   * get selected user's profile
   */
  private getSelectedUserProfile() {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.getUserGifts();
        } else {
          this.router.navigate(['/client']);
        }
      });
    this.isLoadingSpinnerShown = false;
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
        this.isLoadingSpinnerShown = false;
      });
  }
}
