import {Component, OnInit} from '@angular/core';
import {UserAchievement} from '@gw-models';
import {UserAchievementService} from '@gw-services/api';
import {AuthenticationService} from '@gw-services/authentication';
import {ShareMembershipService, ShareUserProfileService} from '@gw-services/shared';
import {Config} from '@gw-config';
import {Router} from '@angular/router';

@Component({
  selector: 'app-membership-achievement',
  templateUrl: './membership-achievement.component.html',
  styleUrls: ['./membership-achievement.component.css']
})
export class MembershipAchievementComponent implements OnInit {
  userAchievements: UserAchievement[];
  currentUserAchievementsPage = 1;
  isLoadingSpinnerShown = true;
  nUserAchievementsPerPage: number;
  totalUserAchievements: number;
  selectedUserProfileId: number;

  /**
   *
   * @param userAchievementService - inject userAchievementService
   * @param shareMembershipService - inject shareMembershipService
   * @param router - inject router
   * @param authentication - inject authentication
   * @param shareUserProfileService - inject shareUserProfileService
   */
  constructor(private userAchievementService: UserAchievementService,
              private shareMembershipService: ShareMembershipService,
              private router: Router,
              private authentication: AuthenticationService,
              private shareUserProfileService: ShareUserProfileService) {
  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.getSelectedMembership();
    this.nUserAchievementsPerPage = 8;
  }

  /**
   *
   * @param event - selected page
   */
  public userAchievementsPageChange(event): void {
    this.currentUserAchievementsPage = event;
    this.getUserAchievements();
  }

  /**
   * get selected membership
   */
  private getSelectedMembership(): void {
    this.shareMembershipService.currentMembership
      .subscribe(selectedMembership => {
        if (selectedMembership) {
          this.selectedUserProfileId = selectedMembership.userProfile.id;
          this.getUserAchievements();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get user-account's achievement's by page
   */
  private getUserAchievements(): void {
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

}
