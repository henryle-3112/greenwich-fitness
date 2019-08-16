import {Component, OnInit} from '@angular/core';
import {UserAchievement} from '@gw-models/core';
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
  userAchievements: UserAchievement[];
  currentUserAchievementsPage: number;
  isLoadingSpinnerShown = true;
  nUserAchievementsPerPage: number;
  totalUserAchievements: number;
  selectedUserProfileId: number;

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
    this.currentUserAchievementsPage = Config.currentPage;
    this.nUserAchievementsPerPage = Config.numberItemsPerPage;
    this.getSelectedCoach();
  }

  /**
   * get selected coach
   */
  private getSelectedCoach() {
    this.shareCoachService.currentCoach
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedUserProfileId = selectedCoach.userProfile.id;
          this.getCoachAchievements();
        } else {
          this.router.navigate(['/client/coach']);
        }
      });
  }

  /**
   * get coach's achievements
   */
  private getCoachAchievements() {
    const getCoachAchievementsUrl = `${Config.apiBaseUrl}/
${Config.apiUserManagementPrefix}/
${Config.apiUserAchievements}?
${Config.userProfileIdParameter}=${this.selectedUserProfileId}&
${Config.pageParameter}=${this.currentUserAchievementsPage}`;
    this.isLoadingSpinnerShown = true;
    this.userAchievementService.getUserAchievements(getCoachAchievementsUrl)
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
    this.getCoachAchievements();
  }


}
