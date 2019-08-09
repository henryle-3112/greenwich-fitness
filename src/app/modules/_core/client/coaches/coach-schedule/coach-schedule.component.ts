import {Component, OnInit} from '@angular/core';
import {Coach, Membership, ResponseMessage, Training, UserProfile} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {ShareCoachService} from '@gw-services/core/shared/coach/share-coach.service';
import {Router} from '@angular/router';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {TrainingService} from '@gw-services/core/api/training/training.service';
import {ShareMembershipScheduleService} from '@gw-services/core/shared/membership-schedule/share-membership-schedule.service';
import {Utils} from '@gw-helpers/core';
import {MembershipService} from '@gw-services/core/api/coach/membership.service';

@Component({
  selector: 'app-coach-schedule',
  templateUrl: './coach-schedule.component.html',
  styleUrls: ['./coach-schedule.component.css']
})
export class CoachScheduleComponent implements OnInit {
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

  // selected user profile
  selectedUserProfile: UserProfile;

  // check current user needs to pay for selected coach after 30 days or not
  isExpired: boolean;

  /**
   *
   * @param shareCoachService - inject shareCoachService
   * @param membershipService - inject membershipService
   * @param shareUserProfileService - inject shareUserProfileService
   * @param shareMembershipSchedule - inject shareMembershipSchedule
   * @param trainingService - inject trainingService
   * @param router - inject router
   */
  constructor(private shareCoachService: ShareCoachService,
              private membershipService: MembershipService,
              private shareUserProfileService: ShareUserProfileService,
              private shareMembershipSchedule: ShareMembershipScheduleService,
              private trainingService: TrainingService,
              private router: Router) {
  }

  /**
   * init data
   */
  ngOnInit() {
    // init number of trainings per page
    this.nTrainingsPerPage = 8;
    // get selected coach
    this.getSelectedCoach();
  }

  /**
   * get selected coach
   */
  private getSelectedCoach() {
    // show loading component
    this.loading = true;
    this.shareCoachService.currentCoach
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          // get selected membership
          this.getSelectedUserProfile();
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
  private getSelectedUserProfile() {
    // show loading component
    this.loading = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          // get selected user profile
          this.selectedUserProfile = selectedUserProfile;
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
    this.membershipService.getMembershipByCoachAndByUserProfile(this.selectedCoach.id, this.selectedUserProfile.id)
      .subscribe((selectedMembership: Membership) => {
        if (selectedMembership) {
          this.selectedMembership = selectedMembership;
          if (this.selectedMembership.status !== 0) {
            this.check30daysIsOverOrNot();
          }
          // get number of trainings
          this.getNumberOfTrainings();
          // get trainings by page
          this.getTrainingsByPage();
        } else {
          // redirect to client page
          this.router.navigate(['/client']);
        }
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
      `${Config.api}/${Config.apiGetTrainingsByPage}/${this.selectedUserProfile.id}/
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
      `${Config.api}/${Config.apiGetNumberOfTrainings}/${this.selectedUserProfile.id}/${this.selectedCoach.id}`;
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
      this.router.navigate(['/client/coach/schedule/detail']);
      // share schedule detail to membership schedule detail component
      this.shareMembershipSchedule.changeMembershipSchedule(selectedSchedule);
    }
  }

}
