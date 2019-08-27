import { Component, OnInit } from '@angular/core';
import { Coach, Membership } from '@gw-models/core';
import { Router } from '@angular/router';
import { Config } from '@gw-config/core';
import { MembershipService } from '@gw-services/core/api/coach/membership.service';
import { ShareMembershipService } from '@gw-services/core/shared/membership/share-membership.service';
import { ShareUserProfileService } from '@gw-services/core/shared/user-profile/share-user-profile.service';
import { ShareCoachService } from '@gw-services/core/shared/coach/share-coach.service';

@Component({
  selector: 'app-coach-membership',
  templateUrl: './coach-membership.component.html',
  styleUrls: ['./coach-membership.component.css']
})

export class CoachMembershipComponent implements OnInit {
  memberships: Membership[];
  currentMembershipsPage;
  isLoadingSpinnerShown = true;
  membershipFullNameKeywords: string;
  nMembershipsPerPage: number;
  totalMemberships: number;
  selectedCoach: Coach;

  /**
   *
   * @param membershipService - inject membershipService
   * @param shareMembershipService - inject shareMembershipService
   * @param shareUserProfileService - inject shareUserProfileService
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
  ngOnInit(): void {
    this.nMembershipsPerPage = Config.numberItemsPerPage;
    this.currentMembershipsPage = Config.currentPage;
    this.membershipFullNameKeywords = '';
    this.getSelectedCoach();
  }

  /**
   * get selected coach
   */
  private getSelectedCoach(): void {
    this.shareCoachService.currentCoach
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          this.getMemberships();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get memberships by current's page
   */
  private getMemberships(): void {
    this.isLoadingSpinnerShown = true;
    const selectedCoachId = this.selectedCoach.id;
    let getMembershipsUrl = `${Config.apiBaseUrl}/
${Config.apiMembershipManagementPrefix}/
${Config.apiMemberships}?
${Config.coachIdParameter}=${selectedCoachId}&
${Config.pageParameter}=${this.currentMembershipsPage}`;
    if (this.membershipFullNameKeywords.localeCompare('') !== 0) {
      getMembershipsUrl += `&${Config.searchParameter}=${this.membershipFullNameKeywords.toLowerCase()}`;
    }
    this.membershipService.getMemberships(getMembershipsUrl)
      .subscribe(response => {
        this.memberships = response.body;
        this.totalMemberships = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param event - selected page
   */
  public membershipsPageChange(event): void {
    this.currentMembershipsPage = event;
    this.getMemberships();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchMembership(keyword): void {
    this.membershipFullNameKeywords = keyword;
    this.currentMembershipsPage = 1;
    this.getMemberships();
  }

  /**
   *
   * @param selectedMembership - selectedMembership that coach want to view information
   */
  public goToMembershipDetail(selectedMembership): void {
    // pass selected membership to membership detail component
    this.shareMembershipService.changeMembership(selectedMembership);
    this.router.navigate(['/client/membership/detail']);
  }
}
