import {Component, OnInit} from '@angular/core';
import {Coach, ResponseMessage} from '@gw-models/core';
import {CoachService} from '../../../../../../services/_core/api/coach/coach.service';
import {ShareCoachService} from '../../../../../../services/_core/shared/coach/share-coach.service';
import {Config} from '@gw-config/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css']
})
export class CoachComponent implements OnInit {

  // list of coaches
  coaches: Coach[];

  // currentPage
  currentPage = 1;

  // loading component is show ot not
  loading = true;

  // search value - return coaches and change pagination based on keywords
  searchValue: string;

  // number coach per page
  nCoachesPerPage: number;

  // total coaches
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
  ngOnInit() {
    // init number of coaches per page
    this.nCoachesPerPage = 8;
    // init current search value
    this.searchValue = '';
    // get total number of coaches
    this.getNumberOfCoaches();
    // get coaches by page
    this.getCoachesByPage();
  }

  /**
   * get coaches by current's page
   */
  private getCoachesByPage() {
    // create url to get coaches by current page
    let currentGetCoachesByPageUrl = `${Config.api}/${Config.apiGetCoachesByPage}/${this.currentPage}/1`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetCoachesByPageUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // show loading component
    this.loading = true;
    // get coaches by page and keywords (if existed)
    this.coachService.getCoachesByPage(currentGetCoachesByPageUrl)
      .subscribe((response: Coach[]) => {
        if (response) {
          this.coaches = [];
          // assign data to coaches
          this.coaches = response;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   *
   * @param event - selected page
   */
  public coachesPageChange(event) {
    // get current's page
    this.currentPage = event;
    // get coaches by page
    this.getCoachesByPage();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchCoach(keyword) {
    // set current search keyword - user-account search coaches by name and change pagination based on keyword
    this.searchValue = keyword;
    // reset current page
    this.currentPage = 1;
    // change pagination
    this.getNumberOfCoaches();
    this.getCoachesByPage();
  }

  /**
   * get total number of coaches
   */
  private getNumberOfCoaches() {
    // create url to get total number of coaches
    let currentGetNumberOfCoachesUrl = `${Config.api}/${Config.apiGetNumberOfCoaches}/1`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetNumberOfCoachesUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // showing loading component
    this.loading = true;
    // get total number of coaches
    this.coachService.getTotalCoaches(currentGetNumberOfCoachesUrl)
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage) {
          // assign total number of galleries to totalGallery
          this.totalCoaches = Number(responseMessage.message);
        }
      });
  }

  /**
   *
   * @param selectedCoach - selected coach that user want to view information
   */
  public goToCoachDetail(selectedCoach) {
    // pass selected coach to coach detail component
    this.shareCoachService.changeCoach(selectedCoach);
    // go to coach detail component
    this.router.navigate(['/client/coach/detail']);
  }
}
