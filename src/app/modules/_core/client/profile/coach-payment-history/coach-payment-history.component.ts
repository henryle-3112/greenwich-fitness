import {Component, OnInit} from '@angular/core';
import {CoachPayment, ResponseMessage, UserProfile} from '@gw-models/core';
import {CoachPaymentService} from '@gw-services/core/api/payment/coach-payment.service';
import {CoachService} from '@gw-services/core/api/coach/coach.service';
import {Router} from '@angular/router';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';

@Component({
  selector: 'app-coach-payment-history',
  templateUrl: './coach-payment-history.component.html',
  styleUrls: ['./coach-payment-history.component.css']
})
export class CoachPaymentHistoryComponent implements OnInit {


  currentPage: number;

  loading: boolean;

  selectedDateCoachPaymentHistories: Date;

  selectedMonthCoachPaymentHistories: number;

  selectedYearCoachPaymentHistories: number;

  nCoachPaymentHistories: number;

  totalCoachPaymentHistories: number;

  selectedUserProfile: UserProfile;

  coachPaymentHistories: CoachPayment[];

  totalCoachPaymentVal: number;

  constructor(private coachPaymentService: CoachPaymentService,
              private coachService: CoachService,
              private router: Router,
              private shareUserProfileService: ShareUserProfileService) {
  }

  ngOnInit() {
    this.currentPage = 1;
    this.coachPaymentHistories = [];
    this.nCoachPaymentHistories = 8;
    this.totalCoachPaymentHistories = 0;
    this.getSelectedUserProfile();
  }

  /**
   * get selected user profile
   */
  private getSelectedUserProfile() {
    this.loading = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe((selectedUserProfile: UserProfile) => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          if (this.selectedDateCoachPaymentHistories) {
            this.getNumberOfCoachPaymentHistories();
            this.getCoachPaymentHistories();
            this.getTotalPaymentByUserProfileIdAndByMonthAndByYear();
          }
        } else {
          // redirect to client page
          this.router.navigate(['/client']);
        }
        this.loading = false;
      });
  }

  /**
   * get number of coach payment histories by user profile id and by month and by year
   */
  private getNumberOfCoachPaymentHistories() {
    this.loading = true;
    this.coachPaymentService.countCoachPaymentsByUserProfileIdAndByMonthAndByYear(
      this.selectedUserProfile.id,
      this.selectedMonthCoachPaymentHistories,
      this.selectedYearCoachPaymentHistories
    )
      .subscribe((nCoachPaymentHistories: ResponseMessage) => {
        if (nCoachPaymentHistories) {
          this.totalCoachPaymentHistories = Number(nCoachPaymentHistories.message);
        }
        this.loading = false;
      });
  }

  /**
   * get coach payment histories by user profile id and by month and by year
   */
  private getCoachPaymentHistories() {
    this.loading = true;
    this.coachPaymentService.getCoachPaymentsByUserProfileIdByMonthByYearByPage(
      this.selectedUserProfile.id,
      this.selectedMonthCoachPaymentHistories,
      this.selectedYearCoachPaymentHistories,
      this.currentPage
    )
      .subscribe((coachPayments: CoachPayment[]) => {
        if (coachPayments) {
          this.coachPaymentHistories = coachPayments;
        }
        this.loading = true;
      });
  }

  /**
   * get total payment by user profile id and by month and by year
   */
  private getTotalPaymentByUserProfileIdAndByMonthAndByYear() {
    this.loading = true;
    this.coachPaymentService.getTotalPaymentByUserProfileIdAndByMonthAndByYear(
      this.selectedUserProfile.id,
      this.selectedMonthCoachPaymentHistories,
      this.selectedYearCoachPaymentHistories
    )
      .subscribe((totalPaymentsByUserProfileIdAndByMonthAndByYear: ResponseMessage) => {
        if (totalPaymentsByUserProfileIdAndByMonthAndByYear) {
          // because the response contains []. For example, [66]. Therefore, we need to get 66
          // by using substring method. Server's result may be changed in the future
          if (totalPaymentsByUserProfileIdAndByMonthAndByYear.message.length > 2 &&
          !totalPaymentsByUserProfileIdAndByMonthAndByYear.message.includes('null')) {
            this.totalCoachPaymentVal = Number(
              totalPaymentsByUserProfileIdAndByMonthAndByYear.message
                .substring(
                  totalPaymentsByUserProfileIdAndByMonthAndByYear.message.indexOf('[') + 1,
                  totalPaymentsByUserProfileIdAndByMonthAndByYear.message.indexOf(']'))
            );
          }
        }
        this.loading = false;
      });
  }

  /**
   *
   * @param event - month that was selected by users to view their coach payment history
   */
  private onMonthChanged(event) {
    if (this.selectedDateCoachPaymentHistories) {
      this.selectedMonthCoachPaymentHistories = this.selectedDateCoachPaymentHistories.getMonth() + 1;
      this.selectedMonthCoachPaymentHistories = this.selectedDateCoachPaymentHistories.getFullYear();
      this.getNumberOfCoachPaymentHistories();
      this.getCoachPaymentHistories();
      this.getTotalPaymentByUserProfileIdAndByMonthAndByYear();
    }
  }

  /**
   *
   * @param event - page that was selected by user
   */
  public coachPaymentHistoriesPageChanged(event) {
    this.currentPage = event;
    this.getNumberOfCoachPaymentHistories();
    this.getCoachPaymentHistories();
  }

}
