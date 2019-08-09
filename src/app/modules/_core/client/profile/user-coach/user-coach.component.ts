import {Component, OnInit} from '@angular/core';
import {Coach, ResponseMessage, UserProfile} from '@gw-models/core';
import {CoachService} from '@gw-services/core/api/coach/coach.service';
import {ShareCoachService} from '@gw-services/core/shared/coach/share-coach.service';
import {Router} from '@angular/router';
import {Config} from '@gw-config/core';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';

@Component({
  selector: 'app-user-coach',
  templateUrl: './user-coach.component.html',
  styleUrls: ['./user-coach.component.css']
})
export class UserCoachComponent implements OnInit {

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

  // selected user's profile
  selectedUserProfile: UserProfile;

  /**
   *
   * @param coachService - inject coach service to interact with coach's data
   * @param shareCoachService - inject share coach service to share selected coach to other component
   * @param router - inject router
   * @param shareUserProfile - inject shareUserProfile
   */
  constructor(private coachService: CoachService,
              private shareCoachService: ShareCoachService,
              private shareUserProfile: ShareUserProfileService,
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
    // get selected user's profile
    this.getSelectedUserProfile();
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile() {
    this.shareUserProfile.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          // get total number of coaches
          this.getNumberOfCoaches();
          // get coaches by page
          this.getCoachesByPage();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get coaches by current's page
   */
  private getCoachesByPage() {
    // create url to get coaches by current page
    let currentGetCoachesByUserProfileByPageUrl =
      `${Config.api}/${Config.apiGetCoachesByUserProfileAndByPage}/${this.selectedUserProfile.id}/${this.currentPage}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetCoachesByUserProfileByPageUrl += `?keyword=${this.searchValue.toLowerCase()}`;
      console.log(currentGetCoachesByUserProfileByPageUrl);
    }
    // show loading component
    this.loading = true;
    // get coaches by page and keywords (if existed)
    this.coachService.getCoachesByUserProfileAndByPage(currentGetCoachesByUserProfileByPageUrl)
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
    let currentGetNumberOfCoachesUrl =
      `${Config.api}/${Config.apiGetNumberOfCoachesByUserProfileAndByPage}/${this.selectedUserProfile.id}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetNumberOfCoachesUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // showing loading component
    this.loading = true;
    // get total number of coaches
    this.coachService.getTotalCoachesByUserProfileAndByPage(currentGetNumberOfCoachesUrl)
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
