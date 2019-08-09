import {Component, OnInit} from '@angular/core';
import {Coach, Membership, ResponseMessage, UserProfile} from '@gw-models/core';
import {Router} from '@angular/router';
import {Config} from '@gw-config/core';
import {MembershipService} from '@gw-services/core/api/coach/membership.service';
import {ShareMembershipService} from '@gw-services/core/shared/membership/share-membership.service';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {ShareCoachService} from '@gw-services/core/shared/coach/share-coach.service';

@Component({
  selector: 'app-coach-membership',
  templateUrl: './coach-membership.component.html',
  styleUrls: ['./coach-membership.component.css']
})

export class CoachMembershipComponent implements OnInit {

  // list of memberships
  memberships: Membership[];

  // currentPage
  currentPage = 1;

  // loading component is show ot not
  loading = true;

  // search value - return memberships and change pagination based on keywords
  searchValue: string;

  // number membership per page
  nMembershipsPerPage: number;

  // total memberships
  totalMemberships: number;

  // selected coach
  selectedCoach: Coach;

  // check pagination is showing or not
  isHidePagination: boolean;

  /**
   *
   * @param membershipService - inject membership service to interact with membership's data
   * @param shareMembershipService - inject share membership service to share selected membership to other component
   * @param shareUserProfileService - inject share user profile service
   * @param shareCoachService - inject shareCoachService
   * @param router - inject router
   */
  constructor(private membershipService: MembershipService,
              private shareMembershipService: ShareMembershipService,
              private shareUserProfileService: ShareUserProfileService,
              private shareCoachService: ShareCoachService,
              private router: Router) {
  }

  /**
   * init data
   */
  ngOnInit() {
    // init number of memberships per page
    this.nMembershipsPerPage = 8;
    // init current search value
    this.searchValue = '';
    // get selected coach
    this.getSelectedCoach();
  }

  /**
   * get selected coach
   */
  private getSelectedCoach() {
    this.shareCoachService.currentCoach
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          // get total number of memberships
          this.getNumberOfMemberships();
          // get memberships by page
          this.getMembershipsByPage();
        } else {
          // redirect to client page
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get memberships by current's page
   */
  private getMembershipsByPage() {
    // create url to get memberships by current page
    let currentGetMembershipsByPageUrl = `${Config.api}/${Config.apiGetMembershipsByPage}/${this.selectedCoach.id}/${this.currentPage}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetMembershipsByPageUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // show loading component
    this.loading = true;
    // get memberships by page and keywords (if existed)
    this.membershipService.getMembershipsByPage(currentGetMembershipsByPageUrl)
      .subscribe((response: Membership[]) => {
        if (response) {
          this.memberships = [];
          // assign data to memberships
          this.memberships = response;
          if (this.memberships.length === 0) {
            this.isHidePagination = true;
          }
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   *
   * @param event - selected page
   */
  public membershipsPageChange(event) {
    // get current's page
    this.currentPage = event;
    // get memberships by page
    this.getMembershipsByPage();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchMembership(keyword) {
    // set current search keyword - user-account search memberships by name and change pagination based on keyword
    this.searchValue = keyword;
    // reset current page
    this.currentPage = 1;
    // change pagination
    this.getNumberOfMemberships();
    this.getMembershipsByPage();
  }

  /**
   * get total number of memberships
   */
  private getNumberOfMemberships() {
    // create url to get total number of memberships
    let currentGetNumberOfMembershipsUrl = `${Config.api}/${Config.apiGetNumberOfMemberships}/${this.selectedCoach.id}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetNumberOfMembershipsUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // showing loading component
    this.loading = true;
    // get total number of memberships
    this.membershipService.getTotalMemberships(currentGetNumberOfMembershipsUrl)
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage) {
          // assign total number of galleries to totalGallery
          this.totalMemberships = Number(responseMessage.message);
        }
      });
  }

  /**
   *
   * @param selectedMembership - selectedMembership that coach want to view information
   */
  public goToMembershipDetail(selectedMembership) {
    // pass selected membership to membership detail component
    this.shareMembershipService.changeMembership(selectedMembership);
    // go to membership detail component
    this.router.navigate(['/client/membership/detail']);
  }
}
