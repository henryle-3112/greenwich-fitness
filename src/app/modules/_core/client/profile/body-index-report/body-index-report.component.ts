import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {BodyIndexService} from '@gw-services/core/api/user/body-index.service';
import {Config} from '@gw-config/core';
import {BodyIndex, UserProfile} from '@gw-models/core';
import {AuthenticationService} from '@gw-services/core/authentication/authentication.service';
import {UserAccountService} from '@gw-services/core/api/user/user-account.service';
import {FacebookAccountService} from '@gw-services/core/api/user/facebook-account.service';
import {GoogleAccountService} from '@gw-services/core/api/user/google-account.service';
import {Chart} from 'chart.js';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidator} from '@gw-services/core/validate/custom-validator';
import {Utils} from '@gw-helpers/core';
import {NzNotificationService} from 'ng-zorro-antd';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';

@Component({
  selector: 'app-body-index-report',
  templateUrl: './body-index-report.component.html',
  styleUrls: ['./body-index-report.component.css']
})
export class BodyIndexReportComponent implements OnInit {
  // check login type
  loginType: string;

  // selected user-account's profile's id
  selectedUserProfileId: number;

  // selected user profile
  selectedUserProfile: UserProfile;

  // check loading component
  loading = false;

  // get body index data ( to show on weight chart )
  bodyIndex: BodyIndex[];

  // check chart is showing or not
  isShowingChart: boolean;

  // create chart
  bodyIndexChart: any;

  // create labels and data for chart
  weightDate: string[];
  weightData: number[];

  // current user-account body index
  currentWeight: number;
  heaviestWeight: number;
  lightestWeight: number;
  currentHeight: number;
  currentBMIResult: number;

  // check body index modal is showing or not
  isChangeBodyIndexModalShown: boolean;

  // form change body index
  bodyIndexForm: FormGroup;

  // get current date to update user-account body index to server
  // if current date and user-account's id existed in the database
  // just update, if not, create new one
  currentDate: string;

  // refer to canvas (chart)
  @ViewChild('canvas') canvas: ElementRef;

  /**
   *
   * @param bodyIndexService - inject bodyIndexService (interact with body index data)
   * @param authentication - inject authentication service (get current user-account's information)
   * @param userAccountService - inject user-account account service (interact with user-account's account data)
   * @param facebookAccountService - inject facebook account service (interact with facebook's account data)
   * @param googleAccountService - inject google account service (interact with google's account data)
   * @param fb - inject form builder - (is used to create change body index form)
   * @param notification - inject notification to shown error or success message
   * @param shareUserProfileService - inject shareUserProfileService
   */
  constructor(private bodyIndexService: BodyIndexService,
              private authentication: AuthenticationService,
              private userAccountService: UserAccountService,
              private facebookAccountService: FacebookAccountService,
              private googleAccountService: GoogleAccountService,
              private fb: FormBuilder,
              private notification: NzNotificationService,
              private shareUserProfileService: ShareUserProfileService) {
  }

  /**
   * init current data
   */
  ngOnInit() {
    this.isShowingChart = true;
    // get current date
    this.currentDate = Utils.getCurrentDate();
    // init form
    this.initForm();
    // get login type
    this.loginType = localStorage.getItem(Config.loginType);
    // load user-account's information to get user-account's id, then get body index
    this.shareUserProfileService.currentUserProfile
      .subscribe(userProfile => {
        this.selectedUserProfile = userProfile;
        this.selectedUserProfileId = userProfile.id;
        this.loadBodyIndexByUserProfileId();
      });
  }

  /**
   * Load body index by using user-account's profile's id,
   * then creating weightDate (labels) and weightData (data) for weight chart,
   * then creating chart and init current body index
   */
  private loadBodyIndexByUserProfileId() {
    // showing loading component
    this.loading = true;
    // create url to get body index
    const getBodyIndexByUserProfileIdUrl = `${Config.api}/${Config.apiGetBodyIndexByUserProfileId}/${this.selectedUserProfileId}`;
    // call service to get body index by user-account's profile's id
    this.bodyIndexService.getBodyIndexByUserProfileId(getBodyIndexByUserProfileIdUrl)
      .subscribe((bodyIndex: BodyIndex[]) => {
        this.bodyIndex = bodyIndex;
        if (this.bodyIndex.length > 0) {
          // show chart if data existed
          this.isShowingChart = true;
          // init labels and data
          this.weightDate = [];
          this.weightData = [];
          this.bodyIndex.map(eachBodyIndex => {
            this.weightDate.push(eachBodyIndex.currentDate);
            this.weightData.push(eachBodyIndex.weight);
          });
          // create chart
          this.createChart();
          // init current body index
          this.getCurrentBodyIndex();
        } else {
          // init body index the first time
          this.initBodyIndexTheFirstTime();
          // hide chart if data is not existed
          this.isShowingChart = false;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * init body index the first time
   */
  private initBodyIndexTheFirstTime() {
    // create body index object
    const bodyIndex = new BodyIndex();
    bodyIndex.weight = 70;
    bodyIndex.height = 170;
    bodyIndex.currentDate = this.currentDate;
    bodyIndex.userProfile = this.selectedUserProfile;
    // add init body index to server
    this.bodyIndexService.updateOrCreateBodyIndex(bodyIndex)
      .subscribe(insertedBodyIndex => {
        if (insertedBodyIndex) {
          // load chart and data again
          this.loadBodyIndexByUserProfileId();
        }
      });
  }

  /**
   * create weight chart by using chart.js
   */
  private createChart() {
    this.bodyIndexChart = new Chart(this.canvas.nativeElement.getContext('2d'), {
      type: 'line',
      data: {
        labels: this.weightDate,
        datasets: [
          {
            label: 'Weight',
            data: this.weightData,
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
  private getCurrentBodyIndex() {
    // find heaviest weight and lightest weight from data
    this.heaviestWeight = this.weightData[0];
    this.lightestWeight = this.weightData[0];
    for (let i = 1; i < this.weightData.length; i++) {
      if (this.weightData[i] > this.heaviestWeight) {
        this.heaviestWeight = this.weightData[i];
      } else if (this.weightData[i] < this.lightestWeight) {
        this.lightestWeight = this.weightData[i];
      }
    }
    // get current weight and current height
    this.currentWeight = this.bodyIndex[this.bodyIndex.length - 1].weight;
    this.currentHeight = this.bodyIndex[this.bodyIndex.length - 1].height;
    // calculate BMI result
    this.calculateBMIResult();
    // hide loading component
    this.loading = false;
  }

  /**
   * calculate BMI result
   */
  private calculateBMIResult() {
    // if currentHeight is not equal to 0, then calcualte BMI result
    // BMI = weight / (height * height)
    // if currentHeight is equal to 0, then assign BMI result to 0
    if (this.currentHeight !== 0) {
      const heightMeter = Number(Number(this.currentHeight / 100).toFixed(2));
      this.currentBMIResult = Number(Number(this.currentWeight / (heightMeter * heightMeter)).toFixed(2));
    } else {
      this.currentBMIResult = 0;
    }
  }

  /**
   * handle event when user-account press on 'cancel' button on change body index modal
   */
  public handleCancelChangeBodyIndexModal() {
    // close change body index modal
    this.isChangeBodyIndexModalShown = false;
  }

  /**
   * handle event when user-account press on 'ok' button on change body index modal
   */
  public handleConfirmChangeBodyIndexModal() {
    // close change body index modal
    this.isChangeBodyIndexModalShown = false;
    // submit form
    this.submitForm();
  }

  /**
   * show body index modal when user-account clicked on 'edit' icon
   */
  public showChangeBodyIndexModal() {
    // show change body index modal
    this.isChangeBodyIndexModalShown = true;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.bodyIndexForm.controls;
  }

  /**
   * init change body index form
   */
  private initForm() {
    // set up validators for register form
    this.bodyIndexForm = this.fb.group({
      weight: [null, [Validators.required]],
      height: [null, [Validators.required, CustomValidator.numberValidator]]
    });

    // current value for all fields to avoid null
    this.f.weight.setValue('');
    this.f.height.setValue('');
  }

  /**
   * Validate weight field
   */
  public validateWeight(): void {
    // if value is empty, the error message will be shown
    if (this.f.weight.value.toString().localeCompare('') === 0) {
      this.f.weight.markAsTouched();
      this.f.weight.setErrors({'required': true});
    }
  }

  /**
   * Validate height field
   */
  public validateHeight(): void {
    // if value is empty, the error message will be shown
    if (this.f.height.value.toString().localeCompare('') === 0) {
      this.f.height.markAsTouched();
      this.f.height.setErrors({'required': true});
    }
  }

  /**
   *
   * @param type - type of notification (success, warning or error)
   * @param title - title of notification
   * @param content - content of notification
   */
  createNotification(type: string, title: string, content: string) {
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
    // stop here if form is invalid
    if (this.bodyIndexForm.invalid) {
      this.createNotification('error', 'Error', 'Cannot submit your form! Please check all fields');
      return;
    }

    // change current weight and current height and bmi
    this.currentWeight = this.f.weight.value;
    this.currentHeight = this.f.height.value;
    this.calculateBMIResult();

    // create body index then submit to the server
    // if current date existed in the database, just update
    // if not, just create
    const bodyIndex = new BodyIndex();
    bodyIndex.currentDate = this.currentDate;
    bodyIndex.weight = this.currentWeight;
    bodyIndex.height = this.currentHeight;
    bodyIndex.userProfile = this.bodyIndex[this.bodyIndex.length - 1].userProfile;
    // update if body index existed or create new one
    this.bodyIndexService.updateOrCreateBodyIndex(bodyIndex)
      .subscribe((selectedBodyIndex: BodyIndex) => {
        if (selectedBodyIndex != null) {
          this.loadBodyIndexByUserProfileId();
        }
      });
  }
}
