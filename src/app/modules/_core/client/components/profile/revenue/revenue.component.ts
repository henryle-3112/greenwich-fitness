import {Component, OnInit} from '@angular/core';
import {CoachPaymentService, CoachService} from '@gw-services/api';
import {Coach, CoachPayment, UserProfile} from '@gw-models';
import {ShareUserProfileService} from '@gw-services/shared';
import {Router} from '@angular/router';
import {Config} from '@gw-config';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {
  currentRevenuesPage: number;
  isLoadingSpinnerShown: boolean;
  selectedDateToViewRevenue: Date;
  selectedMonthToViewRevenue: number;
  selectedYearToViewRevenue: number;
  nRevenuesPerPage: number;
  totalRevenues: number;
  selectedUserProfile: UserProfile;
  selectedCoach: Coach;
  revenues: CoachPayment[];
  totalCoachRevenues: number;

  /**
   *
   * @param coachPaymentService - inject coachPaymentService
   * @param coachService - inject coachService
   * @param shareUserProfileService - inject shareUserProfileService
   * @param router - inject router
   */
  constructor(private coachPaymentService: CoachPaymentService,
              private coachService: CoachService,
              private shareUserProfileService: ShareUserProfileService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.revenues = [];
    this.nRevenuesPerPage = Config.numberItemsPerPage;
    this.currentRevenuesPage = Config.currentPage;
    this.totalRevenues = 0;
    this.getSelectedUserProfile();
  }

  /**
   *
   * @param event - month that was selected by users to view their revenue
   */
  public onMonthChanged(event): void {
    if (this.selectedDateToViewRevenue) {
      // get month and year to get coach payments list
      this.selectedMonthToViewRevenue = this.selectedDateToViewRevenue.getMonth() + 1;
      this.selectedYearToViewRevenue = this.selectedDateToViewRevenue.getFullYear();
      this.getRevenues();
    }
  }

  public revenuesPageChange(event): void {
    this.currentRevenuesPage = event;
    this.getRevenues();
  }

  /**
   * get selected user profile
   */
  private getSelectedUserProfile(): void {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe((selectedUserProfile: UserProfile) => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.getSelectedCoachByUserProfile();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get selected coach by user profile
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
      .subscribe((selectedCoach: Coach) => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          if (this.selectedDateToViewRevenue) {
            this.getRevenues();
          }
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get coach payment by coach id and by page
   */
  private getRevenues(): void {
    this.isLoadingSpinnerShown = true;
    const selectedCoachId = this.selectedCoach.id;
    const getRevenueUrl = `${Config.apiBaseUrl}/
${Config.apiPaymentManagementPrefix}/
${Config.apiCoaches}/
${selectedCoachId}/
${Config.apiCoachesPayment}?
${Config.monthParameter}=${this.selectedMonthToViewRevenue}&
${Config.yearParameter}=${this.selectedYearToViewRevenue}&
${Config.pageParameter}=${this.currentRevenuesPage}`;
    this.coachPaymentService.getCoachPayments(getRevenueUrl)
      .subscribe(response => {
        this.revenues = response.body;
        this.totalRevenues = Number(response.headers.get(Config.headerXTotalCount));
        this.totalCoachRevenues = Number(response.headers.get(Config.headerXTotalPayment));
        this.isLoadingSpinnerShown = false;
      });
  }
}
