import {Component, OnInit} from '@angular/core';
import {TrainingService} from '@gw-services/core/api/training/training.service';
import {Coach, Membership, ResponseMessage, Training, UserProfile} from '@gw-models/core';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {ShareMembershipService} from '@gw-services/core/shared/membership/share-membership.service';
import {Router} from '@angular/router';
import {Config} from '@gw-config/core';
import {CoachService} from '@gw-services/core/api/coach/coach.service';
import {ShareMembershipScheduleService} from '@gw-services/core/shared/membership-schedule/share-membership-schedule.service';
import {Utils} from '@gw-helpers/core';
import {MembershipService} from '@gw-services/core/api/coach/membership.service';

@Component({
  selector: 'app-membership-schedule',
  templateUrl: './membership-schedule.component.html',
  styleUrls: ['./membership-schedule.component.css']
})
export class MembershipScheduleComponent implements OnInit {
  // list of trainings
  trainings: Training[];

  // currentPage
  currentPage = 1;

  // loading component is show ot not
  loading = true;

  // number trainings per page
  nTrainingsPerPage: number;

  // total trainings
  totalTrainings: number;

  // selected coach
  selectedCoach: Coach;

  // selected membership
  selectedMembership: Membership;

  // check pagination is showing or not
  isHidePagination: boolean;

  // check membership did payment (after 30 days)
  isExpired: boolean;

  /**
   *
   * @param trainingService - inject trainingService
   * @param membershipService - inject membershipService
   * @param shareMembershipService - inject shareMembershipService
   * @param coachService - inject CoachService
   * @param shareUserProfileService - inject shareUserProfileService
   * @param shareMembershipSchedule - inject shareMembershipSchedule
   * @param router - inject router
   */
  constructor(private trainingService: TrainingService,
              private membershipService: MembershipService,
              private coachService: CoachService,
              private shareMembershipService: ShareMembershipService,
              private shareUserProfileService: ShareUserProfileService,
              private shareMembershipSchedule: ShareMembershipScheduleService,
              private router: Router) {
  }

  /**
   * init data
   */
  ngOnInit() {
    // init number of trainings per page
    this.nTrainingsPerPage = 8;
    // get selected user's profile
    this.getSelectedUserProfile();
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile() {
    // show loading component
    this.loading = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          // get selected coach
          this.getSelectedCoach(selectedUserProfile);
        } else {
          this.router.navigate(['/client']);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get selected coach
   */
  private getSelectedCoach(selectedUserProfile: UserProfile) {
    // show loading component
    this.loading = true;
    this.coachService.getCoachByUserProfile(selectedUserProfile, 1)
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          // get selected membership
          this.getSelectedMembership();
        } else {
          this.router.navigate(['/client']);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get selected membership
   */
  private getSelectedMembership() {
    // show loading component
    this.loading = true;
    this.shareMembershipService.currentMembership
      .subscribe(selectedMembership => {
        if (selectedMembership) {
          this.selectedMembership = selectedMembership;
          if (this.selectedMembership.status !== 0) {
            // check current membership need to payment after 30 days or not
            this.check30daysIsOverOrNot();
          }
          // get total number of trainings
          this.getNumberOfTrainings();
          // get trainings by page
          this.getTrainingsByPage();
        } else {
          this.router.navigate(['/client']);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * check current membership need to payment after 30 days or not
   */
  private check30daysIsOverOrNot() {
    // get current date
    const currentDate = Utils.getCurrentDate();
    const currentDateObject = new Date(currentDate);
    // get selected membership start date
    const membershipStartDate = this.selectedMembership.startDate
      .toString()
      .substring(0, 10)
      .split('-');
    const membershipStartDateMMddyyyy = membershipStartDate[1] + '/' + membershipStartDate[2] + '/' + membershipStartDate[0];
    const membershipStartDateObject = new Date(membershipStartDateMMddyyyy);
    const diffTime = Math.abs(currentDateObject.getTime() - membershipStartDateObject.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      this.isExpired = true;
      // update status to 0
      this.updateMembershipStatus();
    }
  }

  /**
   * update membership status
   */
  private updateMembershipStatus() {
    // show loading component
    this.loading = true;
    this.selectedMembership.status = 0;
    this.membershipService.updateMembership(this.selectedMembership)
      .subscribe((updatedMembership: Membership) => {
        if (updatedMembership) {
          console.log(updatedMembership);
          // hide loading component
          this.loading = false;
        }
      });
  }

  /**
   * get trainings by current's page
   */
  private getTrainingsByPage() {
    // create url to get trainings by current page
    const currentGetTrainingByPageUrl =
      `${Config.api}/${Config.apiGetTrainingsByPage}/${this.selectedMembership.userProfile.id}/
      ${this.selectedCoach.id}/${this.currentPage}`;
    // show loading component
    this.loading = true;
    // get trainings by page and keywords (if existed)
    this.trainingService.getTrainingsByUserProfileAndByCoachAndPage(currentGetTrainingByPageUrl)
      .subscribe((trainings: Training[]) => {
        if (trainings) {
          this.trainings = [];
          // assign data to trainings
          this.trainings = trainings;
          if (this.trainings.length === 0) {
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
  public trainingsPageChange(event) {
    // get current's page
    this.currentPage = event;
    // get trainings by page
    this.getTrainingsByPage();
  }

  /**
   * get total number of trainings
   */
  private getNumberOfTrainings() {
    // create url to get total number of trainings
    const currentGetNumberOfTrainingsUrl =
      `${Config.api}/${Config.apiGetNumberOfTrainings}/${this.selectedMembership.userProfile.id}/${this.selectedCoach.id}`;
    // showing loading component
    this.loading = true;
    // get total number of trainings
    this.trainingService.countNumberOfTrainingsByUserProfileAndByCoach(currentGetNumberOfTrainingsUrl)
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage) {
          // assign total number of galleries to totalTrainings
          this.totalTrainings = Number(responseMessage.message);
        }
      });
  }

  /**
   *
   * @param selectedSchedule - selected schedule
   */
  private goToScheduleDetail(selectedSchedule) {
    if (selectedSchedule) {
      // go to schedule detail component
      this.router.navigate(['/client/membership/schedule/detail']);
      // share schedule detail to membership schedule detail component
      this.shareMembershipSchedule.changeMembershipSchedule(selectedSchedule);
    }
  }

  /**
   * go to add schedule component
   */
  public goToAddScheduleComponent() {
    // go to schedule detail component
    this.router.navigate(['/client/membership/schedule/add']);
  }
}
