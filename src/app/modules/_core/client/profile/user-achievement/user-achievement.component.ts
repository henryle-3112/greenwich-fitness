import {Component, OnInit} from '@angular/core';
import {UserAchievement} from '@gw-models/core';
import {UserAchievementService} from '@gw-services/core/api/user/user-achievement.service';
import {Config} from '@gw-config/core';
import {UserAccountService} from '@gw-services/core/api/user/user-account.service';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-achievement',
  templateUrl: './user-achievement.component.html',
  styleUrls: ['./user-achievement.component.css']
})
export class UserAchievementComponent implements OnInit {
  userAchievements: UserAchievement[];
  currentUserAchievementsPage;
  isLoadingSpinnerShown = true;
  nUserAchievementsPerPage: number;
  totalUserAchievements: number;
  selectedUserProfileId: number;

  /**
   *
   * @param userAchievementService - inject userAchievementService
   * @param userAccountService - inject userAccountService
   * @param router - inject router
   * @param shareUserProfileService - inject shareUserProfileService
   */
  constructor(private userAchievementService: UserAchievementService,
              private userAccountService: UserAccountService,
              private router: Router,
              private shareUserProfileService: ShareUserProfileService) {
  }

  /**
   * init data
   */
  ngOnInit() {
    this.currentUserAchievementsPage = Config.currentPage;
    this.nUserAchievementsPerPage = Config.numberItemsPerPage;
    this.getSelectedUserProfile();
  }

  /**
   * load current user-account's information
   */
  private getSelectedUserProfile() {
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfileId = selectedUserProfile.id;
          this.getUserAchievements();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get user-account's achievement's by page
   */
  private getUserAchievements() {
    this.isLoadingSpinnerShown = true;
    const getUserAchievementsUrl = `${Config.apiBaseUrl}/
${Config.apiUserManagementPrefix}/
${Config.apiUserAchievements}?
${Config.userProfileIdParameter}=${this.selectedUserProfileId}&
${Config.pageParameter}=${this.currentUserAchievementsPage}`;
    this.userAchievementService.getUserAchievements(getUserAchievementsUrl)
      .subscribe(response => {
        this.userAchievements = response.body;
        this.totalUserAchievements = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param event - selected page
   */
  public userAchievementsPageChange(event) {
    this.currentUserAchievementsPage = event;
    this.getUserAchievements();
  }
}
