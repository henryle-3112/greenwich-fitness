import { Component, OnInit } from '@angular/core';
import { Coach, UserProfile } from '@gw-models';
import { CoachService } from '@gw-services/api';
import { ShareCoachService, ShareUserProfileService } from '@gw-services/shared';
import { Config } from '@gw-config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommended-coaches',
  templateUrl: './recommended-coaches.component.html',
  styleUrls: ['./recommended-coaches.component.css']
})
export class RecommendedCoachesComponent implements OnInit {
  recommendedCoaches: Coach[];
  recommendedCoachIds: number[];
  currentRecommendedCoachesPage: number;
  isLoadingSpinnerShown = true;
  coachFullNameKeywords: string;
  nRecommendedCoachesPerPage: number;
  totalRecommendedCoaches: number;
  selectedUserProfileId: number;

  /**
   *
   * @param coachService - inject coach service to interact with coach's data
   * @param shareCoachService - inject share coach service to share selected coach to other component
   * @param router - inject router
   */
  constructor(private coachService: CoachService,
    private shareCoachService: ShareCoachService,
    private shareUserProfile: ShareUserProfileService,
    private router: Router) { }

  ngOnInit() {
    this.currentRecommendedCoachesPage = Config.currentPage;
    this.nRecommendedCoachesPerPage = Config.numberItemsPerPage;
    this.coachFullNameKeywords = '';
    this.getUserProfile();
  }

  /**
   * get current user
   */
  private getUserProfile(): void {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfile.currentUserProfile
      .subscribe((selectedUserProfile: UserProfile) => {
        if (selectedUserProfile) {
          this.selectedUserProfileId = selectedUserProfile.id;
          this.getRecommendedCoachIds();
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get recommended coach ids
   */
  private getRecommendedCoachIds(): void {
    this.isLoadingSpinnerShown = true;
    const getRecommendedCoachesUrl = `${Config.recommendationSysUrl}/${Config.recommendedCoachesUrl}/${this.selectedUserProfileId}`;
    this.coachService.getRecommendedCoaches(getRecommendedCoachesUrl)
      .subscribe((recommendedCoachIds: number[]) => {
        if (recommendedCoachIds) {
          this.recommendedCoachIds = recommendedCoachIds;
          if (recommendedCoachIds.length !== 0) {
            this.getRecommendedCoaches();
          }
        } else {
          this.totalRecommendedCoaches = 0;
          this.recommendedCoaches = [];
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param recommendedCoachIds - recommended coach ids that will be used to get recommended coaches
   */
  private getRecommendedCoaches(): void {
    this.isLoadingSpinnerShown = true;
    const coachStatus = 1;
    let getCoachesUrl = `${Config.apiBaseUrl}/
${Config.apiCoachManagementPrefix}/
${Config.apiCoaches}?
${Config.statusParameter}=${coachStatus}&
${Config.coachIds}=${this.recommendedCoachIds.join(',')}&
${Config.pageParameter}=${this.currentRecommendedCoachesPage}`;
    if (this.coachFullNameKeywords.localeCompare('') !== 0) {
      getCoachesUrl += `&${Config.searchParameter}=${this.coachFullNameKeywords.toLowerCase()}`;
    }
    this.isLoadingSpinnerShown = true;
    this.coachService.getCoaches(getCoachesUrl)
      .subscribe(response => {
        this.recommendedCoaches = response.body;
        this.totalRecommendedCoaches = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
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

  /**
  *
  * @param event - selected page
  */
  public coachesPageChange(event): void {
    this.currentRecommendedCoachesPage = event;
    this.getRecommendedCoaches();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchCoach(keyword): void {
    this.coachFullNameKeywords = keyword;
    this.currentRecommendedCoachesPage = 1;
    this.getRecommendedCoaches();
  }

}
