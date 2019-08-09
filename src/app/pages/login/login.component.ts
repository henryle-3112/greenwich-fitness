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
  // login form
  loginForm: FormGroup;
  // return url if user-account logged in successfully
  returnUrl: string;
  // check loading component is showing or not
  loading = false;

  /**
   *
   * @param fb - inject form builder to create login form
   * @param route - inject route to get url's parameter
   * @param router - inject router for routing
   * @param authenticationService - inject authentication service to authenticate
   * @param notification - inject notification to show messsage
   * @param zone - zone to run code in angular context
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
  ngOnInit() {
    // set up validators for login form
    this.setUpValidatorLoginForm();
    // reset login status
    // this.authenticationService.logout();
    this.checkUserAuthenticatedOrNot();
    // configure Facebook login
    this.configureFacebookLogin();
    // configure Google login
    this.configureGoogleLogin();
  }

  /**
   * convenience getter for easy access to form fields
   */
  get f() {
    return this.loginForm.controls;
  }

  /**
   *  submit login form
   */
  submitForm(): void {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      // show notification if the loginForm is invalid
      this.createNotification('error', 'Error', 'Please input your user-account\'s name and your\'s password');
      return;
    }
    // show loading component
    this.loading = true;
    // run authentication service
    // authenticate user-account's account
    this.authenticateUserAccount();
  }


  /**
   * get user-account's name and user-account's password, then authenticate user-account's account
   */
  private authenticateUserAccount() {
    this.authenticationService.login(this.f.userName.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          const dataJson = JSON.parse(data);
          if (dataJson && dataJson.token && dataJson.userName) {
            // set login type to normal account
            localStorage.setItem(Config.loginType, 'normal');
            this.loading = false;
            this.router.navigate([this.returnUrl]);
          }
        },
        error => {
          console.log(error);
          localStorage.setItem('currentUserName', '');
          localStorage.setItem('currentUserPassword', '');
          this.loading = false;
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
  private setUpValidatorLoginForm() {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required, CustomValidator.emailValidator]],
      password: [null, [Validators.required, CustomValidator.passwordValidator]]
    });
    // set current value to input fields when the form was loaded the first time to avoid null exception
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
  private checkUserAuthenticatedOrNot() {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      this.router.navigate(['/client']);
    }
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  /**
   * configure facebook login
   */
  private configureFacebookLogin() {
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
    this.loading = true;
    const that = this;
    FB.login((response) => {
      if (response.authResponse) {
        const selectedUserId = response.authResponse.userID;
        that.getFacebookUserInformation(selectedUserId);
      } else {
        // console.log('Facebook Login - User login failed');
        this.createNotification('error', 'Error', 'Cannot login! Please try again!');
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
          // upload facebook's login to the server and get JWT
          const userProfile = new UserProfile();
          userProfile.acceptTermsOfService = 1;
          userProfile.status = 1;
          userProfile.fullName = fullName;
          userProfile.avatar = avatarUrl;
          const facebookAccount = new FacebookAccount();
          facebookAccount.facebookId = userId;
          facebookAccount.userProfile = userProfile;
          that.authenticateFacebookAccount(facebookAccount);
        }
      }
    );
  }

  /**
   *
   * @param facebookAccount - facebook's account will be used to authenticate
   */
  private authenticateFacebookAccount(facebookAccount: FacebookAccount) {
    const that = this;
    this.authenticationService.loginByFacebook(facebookAccount)
      .subscribe(data => {
        const responseData = JSON.parse(data);
        if (responseData.message && responseData.message.localeCompare('failure') === 0) {
          that.createNotification('error', 'Error', 'Your account was blocked!');
        } else {
          that.zone.run(() => {
            // set login type to facebook
            localStorage.setItem(Config.loginType, 'facebook');
            // set facebook's id to get user-account's information as needed
            localStorage.setItem(Config.facebookId, facebookAccount.facebookId);
            that.loading = false;
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
  createNotification(type: string, title: string, content: string) {
    this.notification.create(
      type,
      title,
      content
    );
  }

  /**
   * configure google login
   */
  private configureGoogleLogin() {
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
          // upload google's login to the server and get JWT
          const userProfile = new UserProfile();
          userProfile.acceptTermsOfService = 1;
          userProfile.status = 1;
          userProfile.fullName = googleUserProfile.getName();
          userProfile.avatar = googleUserProfile.getImageUrl();
          const googleAccount = new GoogleAccount();
          googleAccount.googleId = googleUserProfile.getId();
          googleAccount.userProfile = userProfile;
          // authenticate google's account
          that.authenticateGoogleAccount(googleAccount);
        }, function (error) {
          // console.log('Sign-in error', error);
        }
      );
    });
  }

  /**
   * show loading component
   */
  private showLoading() {
    this.loading = true;
  }

  /**
   *
   * @param googleAccount - google account will be used to authenticate
   */
  private authenticateGoogleAccount(googleAccount: GoogleAccount) {
    const that = this;
    // authenticate google account
    this.authenticationService.loginByGoogle(googleAccount)
      .subscribe(data => {
        const responseData = JSON.parse(data);
        if (responseData.message && responseData.message.localeCompare('failure') === 0) {
          that.createNotification('error', 'Error', 'Your account was blocked!');
        } else {
          that.zone.run(() => {
            // set login type to google
            localStorage.setItem(Config.loginType, 'google');
            // set google's id to get information as needed
            localStorage.setItem(Config.googleId, googleAccount.googleId);
            that.loading = false;
            that.router.navigate([that.returnUrl]);
          });
        }
      });
  }
}
