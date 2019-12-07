import {Component, OnInit} from '@angular/core';
import {Coach, Membership, Training, UserProfile} from '@gw-models';
import {Config} from '@gw-config';
import {ShareCoachService, ShareMembershipScheduleService, ShareUserProfileService} from '@gw-services/shared';
import {Router} from '@angular/router';
import {MembershipService, TrainingService} from '@gw-services/api';
import {Utils} from '@gw-helpers';

@Component({
  selector: 'app-coach-schedule',
  templateUrl: './coach-schedule.component.html',
  styleUrls: ['./coach-schedule.component.css']
})
export class CoachScheduleComponent implements OnInit {
  trainings: Training[];
  currentTrainingsPage = 1;
  isLoadingSpinnerShown = true;
  nTrainingsPerPage: number;
  totalTrainings: number;
  selectedCoach: Coach;
  selectedMembership: Membership;
  selectedUserProfile: UserProfile;
  isRelationshipBetweenUserAndCoachExpired: boolean;

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
  ngOnInit(): void {
    this.nTrainingsPerPage = Config.numberItemsPerPage;
    this.getSelectedCoach();
  }

  /**
   *
   * @param event - selected page
   */
  public trainingsPageChange(event): void {
    this.currentTrainingsPage = event;
    this.getTrainings();
  }

  /**
   * get selected coach
   */
  private getSelectedCoach(): void {
    this.isLoadingSpinnerShown = true;
    this.shareCoachService.currentCoach
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          this.getSelectedUserProfile();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get selected membership
   */
  private getSelectedUserProfile(): void {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.getSelectedMembership();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get selected membership
   */
  private getSelectedMembership(): void {
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
          this.selectedMembership = selectedMembership;
          if (this.selectedMembership.status !== 0) {
            this.check30daysIsOverOrNot();
          }
          this.getTrainings();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * check current membership need to payment after 30 days or not
   */
  private check30daysIsOverOrNot(): void {
    const currentDate = Utils.getCurrentDate();
    const currentDateObject = new Date(currentDate);
    const membershipStartDate = this.selectedMembership.startDate
      .toString()
      .substring(0, 10)
      .split('-');
    const membershipStartDateMMddyyyy = membershipStartDate[1] + '/' + membershipStartDate[2] + '/' + membershipStartDate[0];
    const membershipStartDateObject = new Date(membershipStartDateMMddyyyy);
    const diffTime = Math.abs(currentDateObject.getTime() - membershipStartDateObject.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      this.isRelationshipBetweenUserAndCoachExpired = true;
      // update status to 0
      this.updateMembershipStatus();
    }
  }

  /**
   * update membership status
   */
  private updateMembershipStatus(): void {
    this.isLoadingSpinnerShown = true;
    this.selectedMembership.status = 0;
    const updateMembershipUrl = `${Config.apiBaseUrl}/${Config.apiMembershipManagementPrefix}/${Config.apiMemberships}`;
    this.membershipService.updateMembership(updateMembershipUrl, this.selectedMembership)
      .subscribe((updatedMembership: Membership) => {
        if (updatedMembership) {
          console.log(updatedMembership);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get trainings by current's page
   */
  private getTrainings(): void {
    const selectedUserProfileId = this.selectedUserProfile.id;
    const coachId = this.selectedCoach.id;
    const getTrainingsUrl = `${Config.apiBaseUrl}/
${Config.apiTrainingManagementPrefix}/
${Config.apiTrainings}?
${Config.userProfileIdParameter}=${selectedUserProfileId}&
${Config.coachIdParameter}=${coachId}&
${Config.pageParameter}=${this.currentTrainingsPage}`;
    this.isLoadingSpinnerShown = true;
    this.trainingService.getTrainings(getTrainingsUrl)
      .subscribe(response => {
        this.trainings = response.body;
        this.totalTrainings = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param selectedSchedule - selected schedule
   */
  private goToScheduleDetail(selectedSchedule): void {
    if (selectedSchedule) {
      // go to schedule detail component
      this.router.navigate(['/client/coach/schedule/detail']);
      this.shareMembershipSchedule.changeMembershipSchedule(selectedSchedule);
    }
  }

}
