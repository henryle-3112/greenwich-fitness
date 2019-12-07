import {Component, OnInit} from '@angular/core';
import {CoachPayment, UserProfile} from '@gw-models';
import {CoachPaymentService, CoachService} from '@gw-services/api';
import {Router} from '@angular/router';
import {ShareUserProfileService} from '@gw-services/shared';
import {Config} from '@gw-config';

@Component({
  selector: 'app-coach-payment-history',
  templateUrl: './coach-payment-history.component.html',
  styleUrls: ['./coach-payment-history.component.css']
})
export class CoachPaymentHistoryComponent implements OnInit {
  currentCoachPaymentHistoriesPage: number;
  isLoadingSpinnerShown: boolean;
  selectedDateToViewCoachPaymentHistories: Date;
  selectedMonthToViewCoachPaymentHistories: number;
  selectedYearToViewCoachPaymentHistories: number;
  nCoachPaymentHistories: number;
  totalCoachPaymentHistories: number;
  selectedUserProfile: UserProfile;
  coachPaymentHistories: CoachPayment[];
  totalCoachPaymentVal: number;

  /**
   *
   * @param coachPaymentService - inject coachPaymentService
   * @param coachService - inject coachPaymentService
   * @param router - inject coachPaymentService
   * @param shareUserProfileService - inject coachPaymentService
   */
  constructor(private coachPaymentService: CoachPaymentService,
              private coachService: CoachService,
              private router: Router,
              private shareUserProfileService: ShareUserProfileService) {
  }

  ngOnInit(): void {
    this.currentCoachPaymentHistoriesPage = Config.currentPage;
    this.coachPaymentHistories = [];
    this.nCoachPaymentHistories = Config.numberItemsPerPage;
    this.totalCoachPaymentHistories = 0;
    this.getSelectedUserProfile();
  }

  /**
   *
   * @param event - month that was selected by users to view their coach payment history
   */
  public onMonthChanged(event): void {
    if (this.selectedDateToViewCoachPaymentHistories) {
      this.selectedMonthToViewCoachPaymentHistories = this.selectedDateToViewCoachPaymentHistories.getMonth() + 1;
      this.selectedYearToViewCoachPaymentHistories = this.selectedDateToViewCoachPaymentHistories.getFullYear();
      this.getCoachPaymentHistories();
    }
  }

  /**
   *
   * @param event - page that was selected by user
   */
  public coachPaymentHistoriesPageChanged(event): void {
    this.currentCoachPaymentHistoriesPage = event;
    this.getCoachPaymentHistories();
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
          if (this.selectedDateToViewCoachPaymentHistories) {
            this.getCoachPaymentHistories();
          }
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get coach payment histories by user profile id and by month and by year
   */
  private getCoachPaymentHistories(): void {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = this.selectedUserProfile.id;
    const getCoachPaymentHistoriesUrl = `${Config.apiBaseUrl}/
${Config.apiPaymentManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiCoachesPayment}?
${Config.monthParameter}=${this.selectedMonthToViewCoachPaymentHistories}&
${Config.yearParameter}=${this.selectedYearToViewCoachPaymentHistories}&
${Config.pageParameter}=${this.currentCoachPaymentHistoriesPage}`;
    this.coachPaymentService.getCoachPayments(getCoachPaymentHistoriesUrl)
      .subscribe(response => {
        this.coachPaymentHistories = response.body;
        this.totalCoachPaymentHistories = Number(response.headers.get(Config.headerXTotalCount));
        this.totalCoachPaymentVal = Number(response.headers.get(Config.headerXTotalPayment));
        this.isLoadingSpinnerShown = false;
      });
  }

}
