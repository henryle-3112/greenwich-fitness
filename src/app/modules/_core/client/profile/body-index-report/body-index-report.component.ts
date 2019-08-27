import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BodyIndexService } from '@gw-services/core/api/user/body-index.service';
import { Config } from '@gw-config/core';
import { BodyIndex, UserProfile } from '@gw-models/core';
import { AuthenticationService } from '@gw-services/core/authentication/authentication.service';
import { UserAccountService } from '@gw-services/core/api/user/user-account.service';
import { FacebookAccountService } from '@gw-services/core/api/user/facebook-account.service';
import { GoogleAccountService } from '@gw-services/core/api/user/google-account.service';
import { Chart } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '@gw-services/core/validate/custom-validator';
import { Utils } from '@gw-helpers/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { ShareUserProfileService } from '@gw-services/core/shared/user-profile/share-user-profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-body-index-report',
  templateUrl: './body-index-report.component.html',
  styleUrls: ['./body-index-report.component.css']
})
export class BodyIndexReportComponent implements OnInit {
  loginType: string;
  selectedUserProfileId: number;
  selectedUserProfile: UserProfile;
  isLoadingSpinnerShown = false;
  bodyIndexes: BodyIndex[];
  isShowingBodyIndexChart: boolean;
  bodyIndexChart: any;
  weightDateLabels: string[];
  weightDataChart: number[];
  currentUserWeight: number;
  heaviestUserWeight: number;
  lightestUserWeight: number;
  currentUserHeight: number;
  currentUserBMIResult: number;
  isChangeBodyIndexModalShown: boolean;
  bodyIndexForm: FormGroup;
  // get current date to update user-account body index to server
  // if current date and user-account's id existed in the database
  // just update, if not, create new one
  currentDate: string;
  @ViewChild('canvas') canvas: ElementRef;

  /**
   *
   * @param bodyIndexService - inject bodyIndexService
   * @param authentication - inject authentication
   * @param userAccountService - inject userAccountService
   * @param facebookAccountService - inject facebookAccountService
   * @param googleAccountService - inject googleAccountService
   * @param fb - inject fb
   * @param router - inject router
   * @param notification - inject notification
   * @param shareUserProfileService - inject shareUserProfileService
   */
  constructor(private bodyIndexService: BodyIndexService,
    private authentication: AuthenticationService,
    private userAccountService: UserAccountService,
    private facebookAccountService: FacebookAccountService,
    private googleAccountService: GoogleAccountService,
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
    private shareUserProfileService: ShareUserProfileService) {
  }

  /**
   * init current data
   */
  ngOnInit(): void {
    this.isShowingBodyIndexChart = true;
    this.currentDate = Utils.getCurrentDate();
    this.initBodyIndexForm();
    this.loginType = localStorage.getItem(Config.loginType);
    this.getSelectedUserProfile();
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile(): void {
    this.shareUserProfileService.currentUserProfile
      .subscribe(userProfile => {
        if (userProfile) {
          this.selectedUserProfile = userProfile;
          this.selectedUserProfileId = userProfile.id;
          this.getBodyIndexes();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * Load body index by using user-account's profile's id,
   * then creating weightDateLabels (labels) and weightDataChart (data) for weight chart,
   * then creating chart and init current body index
   */
  private getBodyIndexes(): void {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = this.selectedUserProfile.id;
    const getBodyIndexesUrl = `${Config.apiBaseUrl}/
${Config.apiUserManagementPrefix}/
${Config.apiUserBodyIndexes}?
${Config.userProfileIdParameter}=${selectedUserProfileId}`;
    this.bodyIndexService.getBodyIndexes(getBodyIndexesUrl)
      .subscribe((bodyIndexes: BodyIndex[]) => {
        this.bodyIndexes = bodyIndexes;
        if (this.bodyIndexes.length > 0) {
          this.isShowingBodyIndexChart = true;
          this.weightDateLabels = [];
          this.weightDataChart = [];
          this.bodyIndexes.map(eachBodyIndex => {
            this.weightDateLabels.push(eachBodyIndex.currentDate);
            this.weightDataChart.push(eachBodyIndex.weight);
          });
          this.createBodyIndexChart();
          this.getCurrentBodyIndex();
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * create weight chart by using chart.js
   */
  private createBodyIndexChart(): void {
    this.bodyIndexChart = new Chart(this.canvas.nativeElement.getContext('2d'), {
      type: 'line',
      data: {
        labels: this.weightDateLabels,
        datasets: [
          {
            label: 'Weight',
            data: this.weightDataChart,
            backgroundColor: '#1890ff',
            borderColor: '#1890ff',
            borderWidth: 1,
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: true,
          position: 'bottom'
        },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 200,
              stepSize: 50
            }
          }]
        }
      }
    });
  }

  /**
   * get current body index
   */
  private getCurrentBodyIndex(): void {
    this.heaviestUserWeight = this.weightDataChart[0];
    this.lightestUserWeight = this.weightDataChart[0];
    for (let i = 1; i < this.weightDataChart.length; i++) {
      if (this.weightDataChart[i] > this.heaviestUserWeight) {
        this.heaviestUserWeight = this.weightDataChart[i];
      } else if (this.weightDataChart[i] < this.lightestUserWeight) {
        this.lightestUserWeight = this.weightDataChart[i];
      }
    }
    this.currentUserWeight = this.bodyIndexes[this.bodyIndexes.length - 1].weight;
    this.currentUserHeight = this.bodyIndexes[this.bodyIndexes.length - 1].height;
    this.calculateBMIResult();
    this.isLoadingSpinnerShown = false;
  }

  /**
   * calculate BMI result
   */
  private calculateBMIResult(): void {
    // if currentUserHeight is not equal to 0, then calcualte BMI result
    // BMI = weight / (height * height)
    // if currentUserHeight is equal to 0, then assign BMI result to 0
    if (this.currentUserHeight !== 0) {
      const heightMeter = Number(Number(this.currentUserHeight / 100).toFixed(2));
      this.currentUserBMIResult = Number(Number(this.currentUserWeight / (heightMeter * heightMeter)).toFixed(2));
    } else {
      this.currentUserBMIResult = 0;
    }
  }

  /**
   * handle event when user-account press on 'cancel' button on change body index modal
   */
  public handleCancelChangeBodyIndexModal(): void {
    this.isChangeBodyIndexModalShown = false;
  }

  /**
   * handle event when user-account press on 'ok' button on change body index modal
   */
  public handleConfirmChangeBodyIndexModal(): void {
    this.isChangeBodyIndexModalShown = false;
    this.submitForm();
  }

  /**
   * show body index modal when user-account clicked on 'edit' icon
   */
  public showChangeBodyIndexModal(): void {
    this.isChangeBodyIndexModalShown = true;
  }

  /**
   * convenience getter for easy access to form fields
   */
  get f(): any {
    return this.bodyIndexForm.controls;
  }

  /**
   * init change body index form
   */
  private initBodyIndexForm(): void {
    this.bodyIndexForm = this.fb.group({
      weight: [null, [Validators.required]],
      height: [null, [Validators.required, CustomValidator.numberValidator]]
    });

    this.f.weight.setValue('');
    this.f.height.setValue('');
  }

  /**
   * Validate weight field
   */
  public validateWeight(): void {
    if (this.f.weight.value.toString().localeCompare('') === 0) {
      this.f.weight.markAsTouched();
      this.f.weight.setErrors({ 'required': true });
    }
  }

  /**
   * Validate height field
   */
  public validateHeight(): void {
    if (this.f.height.value.toString().localeCompare('') === 0) {
      this.f.height.markAsTouched();
      this.f.height.setErrors({ 'required': true });
    }
  }

  /**
   *
   * @param type - type of notification (success, warning or error)
   * @param title - title of notification
   * @param content - content of notification
   */
  createNotification(type: string, title: string, content: string): void {
    this.notification.create(
      type,
      title,
      content
    );
  }

  /**
   * submit change body index form when user-account clicked on 'ok' button on change body index modal
   */
  submitForm(): void {
    if (this.bodyIndexForm.invalid) {
      this.createNotification('error', 'Error', 'Cannot submit your form! Please check all fields');
      return;
    }
    this.currentUserWeight = this.f.weight.value;
    this.currentUserHeight = this.f.height.value;
    this.calculateBMIResult();
    // create body index then submit to the server
    // if current date existed in the database, just update
    // if not, just create
    const bodyIndexes = new BodyIndex();
    bodyIndexes.currentDate = this.currentDate;
    bodyIndexes.weight = this.currentUserWeight;
    bodyIndexes.height = this.currentUserHeight;
    bodyIndexes.userProfile = this.bodyIndexes[this.bodyIndexes.length - 1].userProfile;
    const updateOrCreateBodyIndexUrl = `${Config.apiBaseUrl}/${Config.apiUserManagementPrefix}/${Config.apiUserBodyIndexes}`;
    this.bodyIndexService.updateOrCreateBodyIndex(updateOrCreateBodyIndexUrl, bodyIndexes)
      .subscribe((selectedBodyIndex: BodyIndex) => {
        if (selectedBodyIndex != null) {
          this.getBodyIndexes();
        }
      });
  }
}
