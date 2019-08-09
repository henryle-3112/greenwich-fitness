import {Component, OnInit} from '@angular/core';
import {ResponseMessage, UserAchievement} from '@gw-models/core';
import {UserAchievementService} from '@gw-services/core/api/user/user-achievement.service';
import {AuthenticationService} from '@gw-services/core/authentication/authentication.service';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {Config} from '@gw-config/core';
import {ShareMembershipService} from '@gw-services/core/shared/membership/share-membership.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-membership-achievement',
  templateUrl: './membership-achievement.component.html',
  styleUrls: ['./membership-achievement.component.css']
})
export class MembershipAchievementComponent implements OnInit {

  // list of user-account's achievements
  userAchievements: UserAchievement[];
  // currentPage
  currentPage = 1;
  // loading component is show ot not
  loading = true;
  // number user-account's achievements per page
  nUserAchievementsPerPage: number;
  // total user-account's achievements
  totalUserAchievements: number;

  // user-account's id
  selectedUserProfileId: number;

  // is hide pagination
  isHidePagination: boolean;

  /**
   *
   * @param userAchievementService - inject user-account's achievement's service to interact with user-account's achievemenet's data
   * @param authentication - inject authentication service to get current user-account's information
   * @param shareMembershipService - inject shareMembershipService
   * @param router - inject router
   * @param shareUserProfileService - inject share user-account's profile service to get user-account's profile information
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
  ngOnInit() {
    // get selected membership
    this.getSelectedMembership();
    // init number user-account achievements per page
    this.nUserAchievementsPerPage = 8;
  }

  /**
   * get selected membership
   */
  private getSelectedMembership() {
    this.shareMembershipService.currentMembership
      .subscribe(selectedMembership => {
        if (selectedMembership) {
          // get selected user's profile's id
          this.selectedUserProfileId = selectedMembership.userProfile.id;
          // get number of user-account's achievements
          this.getNumberOfUserAchievements();
          // get user-account achievement's by page
          this.getUserAchievementsByPage();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get user-account's achievement's by page
   */
  private getUserAchievementsByPage() {
    // create user-account's achievement's url to get user-account's achievements' page
    const currentGetUserAchievementsByPageUrl =
      `${Config.api}/achievements/${String(this.selectedUserProfileId)}/paging/${this.currentPage}`;
    // show loading component
    this.loading = true;
    // call user-account's achievment's service to get user-account's achievements by page
    this.userAchievementService.getUserAchievemnetsByPage(currentGetUserAchievementsByPageUrl)
      .subscribe((response: UserAchievement[]) => {
        if (response) {
          // current user-account's achievements
          this.userAchievements = [];
          // assign user-account's achievements
          this.userAchievements = response;
          // hide pagination if number of user-account's achievements per page is greater than toatl user-account's achievements
          this.isHidePagination = this.nUserAchievementsPerPage > this.userAchievements.length;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get total user-account's achievements
   */
  private getNumberOfUserAchievements() {
    const currentGetNumberOfUserAchievementsUrl = `${Config.api}/${Config.apiGetNumberOfUserAchievements}/${this.selectedUserProfileId}`;
    this.loading = true;
    this.userAchievementService.getTotalUserAchievements(currentGetNumberOfUserAchievementsUrl)
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage) {
          this.totalUserAchievements = Number(responseMessage.message);
        }
      });
  }

  /**
   *
   * @param event - selected page
   */
  public userAchievementsPageChange(event) {
    // get current's page
    this.currentPage = event;
    // get galleries by page
    this.getUserAchievementsByPage();
  }

}
