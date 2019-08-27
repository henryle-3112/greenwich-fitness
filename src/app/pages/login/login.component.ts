import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@gw-services/core/authentication/authentication.service';
import { first } from 'rxjs/operators';
import { CustomValidator } from '@gw-services/core/validate/custom-validator';
import { FacebookAccount, GoogleAccount, UserProfile } from '@gw-models/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { Config } from '@gw-config/core';

declare const FB: any;
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  // return url if user-account logged in successfully
  returnUrl: string;
  isLoadingSpinnerShown = false;

  /**
   *
   * @param fb - inject fb
   * @param route - inject route
   * @param router - inject router
   * @param authenticationService - inject authenticationService
   * @param notification - inject notification
   * @param zone - inject zone
   */
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notification: NzNotificationService,
    private zone: NgZone) {
  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.setUpValidatorLoginForm();
    this.checkUserAuthenticatedOrNot();
    this.configureFacebookLogin();
    this.configureGoogleLogin();
  }

  /**
   * convenience getter for easy access to form fields
   */
  get f(): any {
    return this.loginForm.controls;
  }

  /**
   *  submit login form
   */
  submitForm(): void {
    if (this.loginForm.invalid) {
      this.createNotification('error', 'Error', 'Please input your user-account\'s name and your\'s password');
      return;
    }
    this.isLoadingSpinnerShown = true;
    this.authenticateUserAccount();
  }


  /**
   * get user-account's name and user-account's password, then authenticate user-account's account
   */
  private authenticateUserAccount(): void {
    const loginUrl = `${Config.apiBaseUrl}/${Config.apiLogin}`;
    this.authenticationService.login(loginUrl, this.f.userName.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          const dataJson = JSON.parse(data);
          if (dataJson && dataJson.token && dataJson.userName) {
            localStorage.setItem(Config.loginType, 'normal');
            this.router.navigate([this.returnUrl]);
          }
        },
        error => {
          console.log(error);
          localStorage.setItem('currentUserName', '');
          localStorage.setItem('currentUserPassword', '');
          this.isLoadingSpinnerShown = false;
        }
      );
  }

  /**
   * validate password when user-account blured password field
   */
  validatePassword(): void {
    if (this.f.password.value.toString().localeCompare('') === 0) {
      this.f.password.markAsTouched();
      this.f.password.setErrors({ 'required': true });
    }
  }

  /**
   * validate email when user-account blured email field
   */
  validateEmail(): void {
    if (this.f.userName.value.toString().localeCompare('') === 0) {
      this.f.userName.markAsTouched();
      this.f.userName.setErrors({ 'required': true });
    }
  }

  /**
   * set up validation login form
   */
  private setUpValidatorLoginForm(): void {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required, CustomValidator.emailValidator]],
      password: [null, [Validators.required, CustomValidator.passwordValidator]]
    });
    if (localStorage.getItem('currentUserName')) {
      this.f.userName.setValue(localStorage.getItem('currentUserName'));
    } else {
      this.f.userName.setValue('');
    }
    if (localStorage.getItem('currentUserPassword')) {
      this.f.password.setValue(localStorage.getItem('curerntUserPassword'));
    } else {
      this.f.password.setValue('');
    }
  }

  /**
   * check user-account's authentication existed or not
   */
  private checkUserAuthenticatedOrNot(): void {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      this.router.navigate(['/client']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  /**
   * configure facebook login
   */
  private configureFacebookLogin(): void {
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '637862946640486',
        cookie: true,
        xfbml: true,
        version: 'v3.1'
      });
      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      const js = d.createElement(s);
      js.id = id;
      // @ts-ignore
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  /**
   * login by facebook
   */
  public loginByFacebook(): void {
    const that = this;
    FB.login((response) => {
      if (response.authResponse) {
        that.isLoadingSpinnerShown = true;
        const selectedUserId = response.authResponse.userID;
        that.getFacebookUserInformation(selectedUserId);
      }
    });
  }

  /**
   *
   * @param userId - get facebook's user-account's information
   */
  private getFacebookUserInformation(userId): void {
    const that = this;
    const avatarUrl = `https://graph.facebook.com/${userId}/picture?type=large`;
    /* make the API call */
    FB.api(
      `/${userId}/`,
      function (response) {
        if (response && !response.error) {
          /* handle the result */
          const fullName = response.name;
          const userProfile = that.createUserProfileFromSocialAccount(fullName, avatarUrl);
          const facebookAccount = that.createFacebookAccount(userId, userProfile);
          that.authenticateFacebookAccount(facebookAccount);
        }
      }
    );
  }

  /**
   *
   * @param userId - user's id that will be set to facebook's account
   * @param userProfile - user's profile that will be set to facebook's account
   */
  private createFacebookAccount(userId: string, userProfile: UserProfile): FacebookAccount {
    const facebookAccount = new FacebookAccount();
    facebookAccount.facebookId = userId;
    facebookAccount.userProfile = userProfile;
    return facebookAccount;
  }

  /**
   *
   * @param facebookAccount - facebook's account will be used to authenticate
   */
  private authenticateFacebookAccount(facebookAccount: FacebookAccount): void {
    const that = this;
    const loginByFacebookUrl = `${Config.apiBaseUrl}/${Config.apiFacebookLogin}`;
    this.authenticationService.loginByFacebook(loginByFacebookUrl, facebookAccount)
      .subscribe(data => {
        const responseData = JSON.parse(data);
        if (responseData.message && responseData.message.localeCompare('failure') === 0) {
          that.createNotification('error', 'Error', 'Your account was blocked!');
        } else {
          that.zone.run(() => {
            localStorage.setItem(Config.loginType, 'facebook');
            localStorage.setItem(Config.facebookId, facebookAccount.facebookId);
            that.router.navigate([that.returnUrl]);
          });
        }
      });
  }

  /**
   *
   * @param type - type of notification
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
   * configure google login
   */
  private configureGoogleLogin(): void {
    const that = this;
    gapi.load('auth2', function () {
      const auth2 = gapi.auth2.init({
        client_id: `${Config.googleCredentials}`,
        cookiepolicy: 'single_host_origin',
        scope: 'profile'
      });
      const customButtonGoogleSignIn = document.getElementById('google-sign-in-button');
      auth2.attachClickHandler(customButtonGoogleSignIn, {},
        function (googleUser) {
          const googleUserProfile = googleUser.getBasicProfile();
          const userProfile = that.createUserProfileFromSocialAccount(googleUserProfile.getName(), googleUserProfile.getImageUrl());
          const googleAccount = that.createGoogleAccount(googleUserProfile.getId(), userProfile);
          that.authenticateGoogleAccount(googleAccount);
        }, function (error) {
          console.log(error);
        }
      );
    });
  }

  /**
   *
   * @param googleId - google's id that will be set to google's account
   * @param userProfile - user's profile that will be set to google's account
   */
  private createGoogleAccount(googleId: string, userProfile: UserProfile): GoogleAccount {
    const googleAccount = new GoogleAccount();
    googleAccount.googleId = googleId;
    googleAccount.userProfile = userProfile;
    return googleAccount;
  }

  /**
   * show isLoadingSpinnerShown component
   */
  public loginByGoogle(): void {
    this.isLoadingSpinnerShown = true;
  }

  /**
   *
   * @param googleAccount - google account will be used to authenticate
   */
  private authenticateGoogleAccount(googleAccount: GoogleAccount): void {
    const that = this;
    const loginByGoogleUrl = `${Config.apiBaseUrl}/${Config.apiGoogleLogin}`;
    this.authenticationService.loginByGoogle(loginByGoogleUrl, googleAccount)
      .subscribe(data => {
        const responseData = JSON.parse(data);
        if (responseData.message && responseData.message.localeCompare('failure') === 0) {
          that.createNotification('error', 'Error', 'Your account was blocked!');
        } else {
          that.zone.run(() => {
            localStorage.setItem(Config.loginType, 'google');
            localStorage.setItem(Config.googleId, googleAccount.googleId);
            that.router.navigate([that.returnUrl]);
          });
        }
      });
  }

  /**
   *
   * @param fullName - fullname that will be set to user's profile
   * @param avatarUrl - avatar's url that will be set to avatar's url
   */
  private createUserProfileFromSocialAccount(fullName: string, avatarUrl: string): UserProfile {
    const userProfile = new UserProfile();
    userProfile.acceptTermsOfService = 1;
    userProfile.status = 1;
    userProfile.fullName = fullName;
    userProfile.avatar = avatarUrl;
    return userProfile;
  }
}
