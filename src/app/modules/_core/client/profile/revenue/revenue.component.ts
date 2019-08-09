import {Component, OnInit} from '@angular/core';
import {CoachPaymentService} from '@gw-services/core/api/payment/coach-payment.service';
import {Coach, UserProfile, CoachPayment, ResponseMessage} from '@gw-models/core';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {Router} from '@angular/router';
import {CoachService} from '@gw-services/core/api/coach/coach.service';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {

  // currentPage
  currentPage = 1;

  // check loading component is showing or not
  loading: boolean;

  // selected date to view revenue
  selectedDateToViewRevenue: Date;

  // selected month to view revenue
  selectedMonthToViewRevenue: number;

  // selected year to view revenue
  selectedYearToViewRevenue: number;

  // number coach payments per page
  nCoachPaymentsPerPage: number;

  // total coach payments
  totalCoachPayments: number;

  // selected user's profile
  selectedUserProfile: UserProfile;

  // check current user is coach or normal user. If user is a coach, then get coach's information
  selectedCoach: Coach;

  // list of coach payments
  coachPayments: CoachPayment[];

  // total payment by coach id and by month and by year
  totalPaymentByCoachIdAndMonthAndYear: number;

  constructor(private coachPaymentService: CoachPaymentService,
              private coachService: CoachService,
              private shareUserProfileService: ShareUserProfileService,
              private router: Router) {
  }

  ngOnInit() {
    // init current coach payments
    this.coachPayments = [];
    // init number of coach payments per page
    this.nCoachPaymentsPerPage = 8;
    // init total number of coach payments
    this.totalCoachPayments = 0;
    // get selected user profile
    this.getSelectedUserProfile();
  }

  /**
   * get selected user profile
   */
  private getSelectedUserProfile() {
    // show loading component
    this.loading = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe((selectedUserProfile: UserProfile) => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          // get selected coach by user profile
          this.getSelectedCoachByUserProfile();
        } else {
          // redirect to client page
          this.router.navigate(['/client']);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get selected coach by user profile
   */
  private getSelectedCoachByUserProfile() {
    this.coachService.getCoachByUserProfile(this.selectedUserProfile, 1)
      .subscribe((selectedCoach: Coach) => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          if (this.selectedDateToViewRevenue) {
            // get number of coach payments
            this.getNumberOfCoachPaymentsByCoachId();
            // get list of coach payments by coach id and by page
            this.getCoachPaymentsByCoachIdAndByPage();
            // get total payment for selected month and year
            this.getTotalPaymentByCoachIdAndByMonthAndYear();
          }
        } else {
          // redirect to client page
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get number of coach payments by coach id
   */
  private getNumberOfCoachPaymentsByCoachId() {
    // show loading component
    this.loading = true;
    // get number of coah payments by coach id
    this.coachPaymentService.countCoachPaymentsByCoachIdAndByMonthAndByYear(
      this.selectedCoach.id,
      this.selectedMonthToViewRevenue,
      this.selectedYearToViewRevenue
    )
      .subscribe((nCoachPayments: ResponseMessage) => {
        if (nCoachPayments) {
          this.totalCoachPayments = Number(nCoachPayments.message);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get coach payment by coach id and by page
   */
  private getCoachPaymentsByCoachIdAndByPage() {
    // show loading component
    this.loading = true;
    // get coach payments
    this.coachPaymentService.getCoachPaymentsByCoachIdByMonthByYearByPage(
      this.selectedCoach.id,
      this.selectedMonthToViewRevenue,
      this.selectedYearToViewRevenue,
      this.currentPage
    )
      .subscribe((coachPayments: CoachPayment[]) => {
        if (coachPayments) {
          this.coachPayments = coachPayments;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get total payment by coach id and by month and by year
   */
  private getTotalPaymentByCoachIdAndByMonthAndYear() {
    // show loading component
    this.loading = true;
    // get coach payment
    this.coachPaymentService.getTotalPaymentByCoachIdAndByMonthAndByYear(
      this.selectedCoach.id,
      this.selectedMonthToViewRevenue,
      this.selectedYearToViewRevenue
    )
      .subscribe((totalPayment: ResponseMessage) => {
        if (totalPayment) {
          // because the response contains []. For example, [66]. Therefore, we need to get 66
          // by using substring method
          this.totalPaymentByCoachIdAndMonthAndYear = Number(
            totalPayment.message
              .substring(totalPayment.message.indexOf('[') + 1, totalPayment.message.indexOf(']'))
          );
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   *
   * @param event - month that was selected by users to view their revenue
   */
  private onMonthChanged(event) {
    // get month and year to get coach payments list
    this.selectedMonthToViewRevenue = this.selectedDateToViewRevenue.getMonth() + 1;
    this.selectedYearToViewRevenue = this.selectedDateToViewRevenue.getFullYear();
    // get number of coach payments by coach id, month, year
    this.getNumberOfCoachPaymentsByCoachId();
    // get coach payments by coach id, month, year
    this.getCoachPaymentsByCoachIdAndByPage();
    // get total payment for selected month and year
    this.getTotalPaymentByCoachIdAndByMonthAndYear();
  }

  public coachPaymentsPageChange(event) {
    this.currentPage = event;
    this.getNumberOfCoachPaymentsByCoachId();
    this.getCoachPaymentsByCoachIdAndByPage();
  }
}
