import {Component, OnInit} from '@angular/core';
import {Coach} from '@gw-models';
import {CoachService} from '@gw-services/api';
import {ShareCoachService} from '@gw-services/shared';
import {Config} from '@gw-config';
import {Router} from '@angular/router';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css']
})
export class CoachComponent implements OnInit {
  coaches: Coach[];
  currentCoachesPage: number;
  isLoadingSpinnerShown = true;
  coachFullNameKeywords: string;
  nCoachesPerPage: number;
  totalCoaches: number;

  /**
   *
   * @param coachService - inject coach service to interact with coach's data
   * @param shareCoachService - inject share coach service to share selected coach to other component
   * @param router - inject router
   */
  constructor(private coachService: CoachService,
              private shareCoachService: ShareCoachService,
              private router: Router) {
  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.currentCoachesPage = Config.currentPage;
    this.nCoachesPerPage = Config.numberItemsPerPage;
    this.coachFullNameKeywords = '';
    this.getCoaches();
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

  /**
   * get coaches by current's page
   */
  private getCoaches(): void {
    const coachStatus = 1;
    let getCoachesUrl = `${Config.apiBaseUrl}/
${Config.apiCoachManagementPrefix}/
${Config.apiCoaches}?
${Config.statusParameter}=${coachStatus}&
${Config.pageParameter}=${this.currentCoachesPage}`;
    if (this.coachFullNameKeywords.localeCompare('') !== 0) {
      getCoachesUrl += `&${Config.searchParameter}=${this.coachFullNameKeywords.toLowerCase()}`;
    }
    this.isLoadingSpinnerShown = true;
    this.coachService.getCoaches(getCoachesUrl)
      .subscribe(response => {
        this.coaches = response.body;
        this.totalCoaches = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }
}
