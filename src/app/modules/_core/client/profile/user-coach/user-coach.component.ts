import {Component, OnInit} from '@angular/core';
import {Coach, UserProfile} from '@gw-models/core';
import {ShareCoachService} from '@gw-services/core/shared/coach/share-coach.service';
import {Router} from '@angular/router';
import {Config} from '@gw-config/core';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {MembershipService} from '@gw-services/core/api/coach/membership.service';

@Component({
  selector: 'app-user-coach',
  templateUrl: './user-coach.component.html',
  styleUrls: ['./user-coach.component.css']
})
export class UserCoachComponent implements OnInit {
  coaches: Coach[];
  currentCoachesPage;
  isLoadingSpinnerShown = true;
  coachFullNameKeywords: string;
  nCoachesPerPage: number;
  totalCoaches: number;
  selectedUserProfile: UserProfile;

  /**
   * @param membershipService - inject membershipService
   * @param shareCoachService - inject ShareCoachService
   * @param router - inject router
   * @param shareUserProfile - inject shareUserProfile
   */
  constructor(private membershipService: MembershipService,
              private shareCoachService: ShareCoachService,
              private shareUserProfile: ShareUserProfileService,
              private router: Router) {
  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.currentCoachesPage = Config.currentPage;
    this.nCoachesPerPage = Config.numberItemsPerPage;
    this.coachFullNameKeywords = '';
    this.getSelectedUserProfile();
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile(): void {
    this.shareUserProfile.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.getCoaches();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get coaches by current's page
   */
  private getCoaches(): void {
    const selectedUserProfileId = this.selectedUserProfile.id;
    const membershipStatus = 1;
    let getCoachesUrl = `${Config.apiBaseUrl}/
${Config.apiMembershipManagementPrefix}/
${Config.apiMembershipCoaches}?
${Config.userProfileIdParameter}=${selectedUserProfileId}&
${Config.statusParameter}=${membershipStatus}&
${Config.pageParameter}=${this.currentCoachesPage}`;
    if (this.coachFullNameKeywords.localeCompare('') !== 0) {
      getCoachesUrl += `?${Config.searchParameter}=${this.coachFullNameKeywords.toLowerCase()}`;
    }
    this.isLoadingSpinnerShown = true;
    this.membershipService.getCoaches(getCoachesUrl)
      .subscribe(response => {
        this.coaches = response.body;
        this.totalCoaches = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param event - selected page
   */
  public coachesPageChange(event): void {
    this.currentCoachesPage = event;
    this.getCoaches();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchCoach(keyword): void {
    this.coachFullNameKeywords = keyword;
    this.currentCoachesPage = 1;
    this.getCoaches();
  }

  /**
   *
   * @param selectedCoach - selected coach that user want to view information
   */
  public goToCoachDetail(selectedCoach): void {
    // pass selected coach to coach detail component
    this.shareCoachService.changeCoach(selectedCoach);
    this.router.navigate(['/client/coach/detail']);
  }

}
