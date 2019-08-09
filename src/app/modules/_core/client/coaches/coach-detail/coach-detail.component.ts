import {Component, OnInit} from '@angular/core';
import {ShareCoachService} from '@gw-services/core/shared/coach/share-coach.service';
import {Coach, Membership, UserProfile} from '@gw-models/core';
import {Router} from '@angular/router';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {MembershipService} from '@gw-services/core/api/coach/membership.service';

@Component({
  selector: 'app-coach-detail',
  templateUrl: './coach-detail.component.html',
  styleUrls: ['./coach-detail.component.css']
})
export class CoachDetailComponent implements OnInit {

  // selected coach
  selectedCoach: Coach;

  // selected user's profile
  selectedUserProfile: UserProfile;

  // check relationship between coacah and user existed or not
  isRelationshipExisted: boolean;

  // check coach's information should be shown or not
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

  ngOnInit() {
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
          // check selected coach existed or not
          this.checkSelectedCoachExistedOrNot();
        }
      });
  }

  /**
   * check selected coach existed or not
   */
  private checkSelectedCoachExistedOrNot() {
    if (this.selectedCoach == null) {
      // go to coach list
      this.router.navigate(['/client/coach']);
    } else {
      // get selected user's profile
      this.getSelectedUserProfile();
    }
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile() {
    this.shareUserProfile.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          // check relationship between user and coach
          this.checkRelationshipBetweenUserAndCoach();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * check relationship between user and coach
   */
  private checkRelationshipBetweenUserAndCoach() {
    this.membershipService.getMembershipByCoachAndByUserProfile(this.selectedCoach.id, this.selectedUserProfile.id)
      .subscribe((selectedMembership: Membership) => {
        if (selectedMembership) {
          this.isRelationshipExisted = true;
        } else {
          this.router.navigate(['/client']);
        }
        // show coach information component
        this.isCoachInformationShow = true;
      });
  }
}
