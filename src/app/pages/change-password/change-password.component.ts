import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomValidator} from '@gw-services/core/validate/custom-validator';
import {ResetPasswordService} from '@gw-services/core/api/user/reset-password.service';
import {ResponseMessage, UserAccount} from '@gw-models/core';
import {NzNotificationService} from 'ng-zorro-antd';
import {AuthenticationService} from '@gw-services/core/authentication/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  // change password form
  changePasswordForm: FormGroup;
  // get password reminder token
  passwordReminderToken: string;
  // check loading component is showing or not
  loading = false;

  /**
   *
   * @param fb - inject form builder to create change password form
   * @param authenticationService - inject authenticationService
   * @param route - inject route to get url's parameter
   * @param router - inject router for routing
   * @param resetPasswordService - inject reset password's service to change user-account's password
   * @param notification - inject notification to get message
   */
  constructor(private fb: FormBuilder,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router,
              private resetPasswordService: ResetPasswordService,
              private notification: NzNotificationService) {
  }

  /**
   * init data
   */
  ngOnInit() {
    // set up validators for login form
    this.changePasswordForm = this.fb.group({
      confirmPassword: [null, [Validators.required, CustomValidator.passwordValidator]],
      password: [null, [Validators.required, CustomValidator.passwordValidator]]
    });
    // set current value to input fields when the form was loaded the first time to avoid null exception
    this.f.password.setValue('');
    this.f.confirmPassword.setValue('');
    // get passwordReminderToken from route parameters.
    this.passwordReminderToken = this.route.snapshot.queryParams['token'] || '';
    // if password reminder token does not existed. Therefore, password cannot be changed
    // customers will be redirected to login page
    if (this.passwordReminderToken.localeCompare('') === 0) {
      // redirect to login page
      this.router.navigate(['/login']);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.changePasswordForm.controls;
  }

  // submit login form
  submitForm(): void {
    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
      return;
    }
    // update new password to the database server
    const updatedUserAccount = new UserAccount();
    updatedUserAccount.passwordReminderToken = this.passwordReminderToken;
    updatedUserAccount.password = this.f.password.value;
    this.resetUserPassword(updatedUserAccount);
  }

  /**
   *
   * @param updatedUserAccount - updated user-account's account to change password
   */
  resetUserPassword(updatedUserAccount: UserAccount): void {
    // change password
    this.resetPasswordService.changePassword(updatedUserAccount)
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage.message.localeCompare('successfully') === 0) {
          // show success message
          this.createNotification('success', 'Success', 'Your password was changed successfully');
        } else {
          // show error message
          this.createNotification('error', 'Error', 'Your password cannot be changed');
        }
        // logout if user has logged in
        this.authenticationService.logout();
        // redirect to login page
        this.router.navigate(['/login']);
        // hide loading component
        this.loading = false;
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
   * validate password
   */
  validatePassword(): void {
    if (this.f.password.value.toString().localeCompare('') === 0) {
      this.f.password.markAsTouched();
      this.f.password.setErrors({'required': true});
    }
  }

  /**
   * validate confirm password
   */
  validateConfirmPassword(): void {
    if (this.f.confirmPassword.value.toString().localeCompare(this.f.password.value) !== 0) {
      // show error if confirm password and password are not the same
      this.f.confirmPassword.markAsTouched();
      this.f.confirmPassword.setErrors({'required': true});
    } else {
      this.f.confirmPassword.setErrors(null);
    }
  }
}
