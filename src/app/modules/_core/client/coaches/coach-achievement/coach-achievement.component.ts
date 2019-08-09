import {Component, OnInit} from '@angular/core';
import {ResponseMessage, UserAchievement} from '@gw-models/core';
import {UserAchievementService} from '@gw-services/core/api/user/user-achievement.service';
import {UserAccountService} from '@gw-services/core/api/user/user-account.service';
import {ShareCoachService} from '@gw-services/core/shared/coach/share-coach.service';
import {Config} from '@gw-config/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-coach-achievement',
  templateUrl: './coach-achievement.component.html',
  styleUrls: ['./coach-achievement.component.css']
})
export class CoachAchievementComponent implements OnInit {

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
   * @param userAccountService - inject user-account's account service to interact with user-account's account's data
   * @param shareCoachService - inject share coach service to get user-account's profile information
   * @param router - inject router
   */
  constructor(private userAchievementService: UserAchievementService,
              private userAccountService: UserAccountService,
              private shareCoachService: ShareCoachService,
              private router: Router) {
  }

  /**
   * init data
   */
  ngOnInit() {
    // load current user-account information and get user-account's achievements by page
    this.loadCurrentUserInformation();
    // init number user-account achievements per page
    this.nUserAchievementsPerPage = 8;
  }

  /**
   * get user-account's achievement's by page
   */
  private getUserAchievementsByPage() {
    // create user-account's achievement's url to get user-account's achievements' page
    const currentGetUserAchievementsByPageUrl =
      `${Config.api}/achievements/${String(this.selectedUserProfileId)}/paging/${this.currentPage}`;
    console.log(`currentGetUserAchievementsByPageUrl: ${currentGetUserAchievementsByPageUrl}`);
    // show loading component
    this.loading = true;
    // call user-account's achievement's service to get user-account's achievements by page
    this.userAchievementService.getUserAchievemnetsByPage(currentGetUserAchievementsByPageUrl)
      .subscribe((response: UserAchievement[]) => {
        if (response) {
          console.log(`User Achievements: `);
          console.log(response);
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

  /**
   * load current user-account's information
   */
  private loadCurrentUserInformation() {
    // get current user-account's profile
    this.shareCoachService.currentCoach
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedUserProfileId = selectedCoach.userProfile.id;
          console.log(`Coach achievement: ${this.selectedUserProfileId}`);
          // get number of user-account's achievements
          this.getNumberOfUserAchievements();
          // get user-account achievement's by page
          this.getUserAchievementsByPage();
        } else {
          this.router.navigate(['/client/coach']);
        }
      });
  }

}
