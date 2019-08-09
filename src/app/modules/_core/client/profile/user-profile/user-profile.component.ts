import {Component, OnInit} from '@angular/core';
import {Coach, UserProfile} from '@gw-models/core';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {Router} from '@angular/router';
import {CoachService} from '@gw-services/core/api/coach/coach.service';
import {ShareCoachService} from '@gw-services/core/shared/coach/share-coach.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  // get selected coach
  selectedCoach: Coach;

  // get selected user's profile
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

  ngOnInit() {
    // get user's profile
    this.getSelectedUserProfile();
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile() {
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          // get selected coach by user's profile
          this.getSelectedCoachByUserProfile();
          // get selected membership by user's profile
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get selected coach by user's profile
   */
  private getSelectedCoachByUserProfile() {
    this.coachService.getCoachByUserProfile(this.selectedUserProfile, 1)
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          this.shareCoachService.changeCoach(this.selectedCoach);
        }
      });
  }
}
