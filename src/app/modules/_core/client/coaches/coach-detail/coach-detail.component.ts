import { Component, OnInit } from '@angular/core';
import { ShareCoachService } from '@gw-services/core/shared/coach/share-coach.service';
import { Coach, Membership, UserProfile } from '@gw-models/core';
import { Router } from '@angular/router';
import { ShareUserProfileService } from '@gw-services/core/shared/user-profile/share-user-profile.service';
import { MembershipService } from '@gw-services/core/api/coach/membership.service';
import { Config } from '@gw-config/core';

@Component({
  selector: 'app-coach-detail',
  templateUrl: './coach-detail.component.html',
  styleUrls: ['./coach-detail.component.css']
})
export class CoachDetailComponent implements OnInit {
  selectedCoach: Coach;
  selectedUserProfile: UserProfile;
  isRelationshipBetWeenUserAndCoachExisted: boolean;
  isCoachInformationShow: boolean;

  /**
   *
   * @param shareCoachService - inject shareCoachService
   * @param shareUserProfile - inject shareUserProfile
   * @param membershipService - inject membershipService
   * @param router - inject router
   */
  constructor(private shareCoachService: ShareCoachService,
    private shareUserProfile: ShareUserProfileService,
    private membershipService: MembershipService,
    private router: Router) {
  }

  ngOnInit(): void {
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
          this.getSelectedUserProfile();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile(): void {
    this.shareUserProfile.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.checkRelationshipBetweenUserAndCoach();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * check relationship between user and coach
   */
  private checkRelationshipBetweenUserAndCoach(): void {
    const selectedUserProfileId = this.selectedUserProfile.id;
    const selectedCoachId = this.selectedCoach.id;
    const getMembershipUrl = `${Config.apiBaseUrl}/
${Config.apiMembershipManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiCoaches}/
${selectedCoachId}/
${Config.apiMemberships}`;
    this.membershipService.getMembership(getMembershipUrl)
      .subscribe((selectedMembership: Membership) => {
        if (selectedMembership) {
          this.isRelationshipBetWeenUserAndCoachExisted = true;
        }
        this.isCoachInformationShow = true;
      });
  }
}
