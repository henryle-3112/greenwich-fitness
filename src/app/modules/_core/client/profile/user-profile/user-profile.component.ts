import { Component, OnInit } from '@angular/core';
import { Coach, UserProfile } from '@gw-models/core';
import { ShareUserProfileService } from '@gw-services/core/shared/user-profile/share-user-profile.service';
import { Router } from '@angular/router';
import { CoachService } from '@gw-services/core/api/coach/coach.service';
import { ShareCoachService } from '@gw-services/core/shared/coach/share-coach.service';
import { Config } from '@gw-config/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  selectedCoach: Coach;
  selectedUserProfile: UserProfile;

  /**
   *
   * @param shareUserProfileService - inject share user's profile service
   * @param shareCoachService - inject share coach's service
   * @param coachService - inject coachService
   * @param router - inject router
   */
  constructor(private shareUserProfileService: ShareUserProfileService,
    private shareCoachService: ShareCoachService,
    private coachService: CoachService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.getSelectedUserProfile();
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile(): void {
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.getSelectedCoachByUserProfile();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get selected coach by user's profile
   */
  private getSelectedCoachByUserProfile(): void {
    const selectedUserProfileId = this.selectedUserProfile.id;
    const coachStatus = 1;
    const getCoachUrl = `${Config.apiBaseUrl}/
${Config.apiCoachManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiCoaches}?
${Config.statusParameter}=${coachStatus}`;
    this.coachService.getCoach(getCoachUrl)
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          this.shareCoachService.changeCoach(this.selectedCoach);
        }
      });
  }
}
