import {Component, OnInit} from '@angular/core';
import {CoachPaymentService} from '@gw-services/core/api/payment/coach-payment.service';
import {Coach, UserProfile, CoachPayment} from '@gw-models/core';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {Router} from '@angular/router';
import {CoachService} from '@gw-services/core/api/coach/coach.service';
import {Config} from '@gw-config/core';

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

  /**
   *
   * @param event - month that was selected by users to view their revenue
   */
  private onMonthChanged(event): void {
    // get month and year to get coach payments list
    this.selectedMonthToViewRevenue = this.selectedDateToViewRevenue.getMonth() + 1;
    this.selectedYearToViewRevenue = this.selectedDateToViewRevenue.getFullYear();
    this.getRevenues();
  }

  public revenuesPageChange(event): void {
    this.currentRevenuesPage = event;
    this.getRevenues();
  }
}
