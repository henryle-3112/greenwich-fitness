import {Component, OnInit} from '@angular/core';
import {CoachService, MembershipService, TrainingService} from '@gw-services/api';
import {Coach, Membership, Training, UserProfile} from '@gw-models';
import {ShareMembershipScheduleService, ShareMembershipService, ShareUserProfileService} from '@gw-services/shared';
import {Router} from '@angular/router';
import {Config} from '@gw-config';
import {Utils} from '@gw-helpers';

@Component({
  selector: 'app-membership-schedule',
  templateUrl: './membership-schedule.component.html',
  styleUrls: ['./membership-schedule.component.css']
})
export class MembershipScheduleComponent implements OnInit {
  trainings: Training[];
  currentTrainingsPage = 1;
  isLoadingSpinnerShown = true;
  nTrainingsPerPage: number;
  totalTrainings: number;
  selectedCoach: Coach;
  selectedMembership: Membership;
  isRelationshipBetweenUserAndCoachExpired: boolean;

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
  ngOnInit(): void {
    this.nTrainingsPerPage = 8;
    this.getSelectedUserProfile();
  }

  /**
   *
   * @param event - selected page
   */
  public trainingsPageChange(event): void {
    this.currentTrainingsPage = event;
    this.getTrainingsByPage();
  }

  /**
   * go to add schedule component
   */
  public goToAddScheduleComponent(): void {
    this.router.navigate(['/client/membership/schedule/add']);
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile(): void {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.getSelectedCoach(selectedUserProfile);
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param selectedUserProfile - user's profile that will be used to get selected coach
   */
  private getSelectedCoach(selectedUserProfile: UserProfile): void {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = selectedUserProfile.id;
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
    this.isLoadingSpinnerShown = true;
    this.shareMembershipService.currentMembership
      .subscribe(selectedMembership => {
        if (selectedMembership) {
          this.selectedMembership = selectedMembership;
          if (this.selectedMembership.status !== 0) {
            this.check30daysIsOverOrNot();
          }
          this.getTrainingsByPage();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
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
      .subscribe(() => {
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get trainings by current's page
   */
  private getTrainingsByPage(): void {
    const selectedUserProfileId = this.selectedMembership.userProfile.id;
    const selectedCoachId = this.selectedCoach.id;
    const getTrainingsUrl = `${Config.apiBaseUrl}/
${Config.apiTrainingManagementPrefix}/
${Config.apiTrainings}?
${Config.userProfileIdParameter}=${selectedUserProfileId}&
${Config.coachIdParameter}=${selectedCoachId}&
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
      this.router.navigate(['/client/membership/schedule/detail']);
      this.shareMembershipSchedule.changeMembershipSchedule(selectedSchedule);
    }
  }
}
