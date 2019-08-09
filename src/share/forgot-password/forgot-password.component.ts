import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidator} from '@gw-services/core/validate/custom-validator';
import {ResetPasswordService} from '@gw-services/core/api/user/reset-password.service';
import {ResponseMessage} from '@gw-models/core';
import {NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  // forgot password form
  forgotPasswordForm: FormGroup;
  // check loading component is showing or not
  loading = false;

  /**
   *
   * @param fb - inject form builder to create forgot password form
   * @param resetPasswordService - inject reset password service to change password
   * @param router - inject router
   * @param notification - inject notification to show message to user-account
   */
  constructor(
    private fb: FormBuilder,
    private resetPasswordService: ResetPasswordService,
    private router: Router,
    private notification: NzNotificationService) {
  }

  /**
   * init data
   */
  ngOnInit() {
    // set up validators for login form
    this.forgotPasswordForm = this.fb.group({
      email: [null, [Validators.required, CustomValidator.emailValidator]]
    });
    // set current value to input fields when the form was loaded the first time to avoid null exception
    this.f.email.setValue('');
  }

  /**
   * convenience getter for easy access to form fields
   */
  get f() {
    return this.forgotPasswordForm.controls;
  }

  /**
   * submit login form
   */
  submitForm(): void {
    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    // show loading component
    this.loading = true;
    // change reset password
    this.resetPasswordService.sendEmailToResetPassword(this.f.email.value.toString())
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage.message.localeCompare('successfully') === 0) {
          // show success message
          this.createNotification('success', 'Successfully', 'Email was sent successfully, if you do not see the email, please try again!');
          // redirect to login page
          this.router.navigate(['/login']);
        } else {
          // hide success message
          this.createNotification('error', 'Error', 'Email cannot be sent. Please try again!');
        }
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
   * validate email
   */
  validateEmail(): void {
    if (this.f.email.value.toString().localeCompare('') === 0) {
      this.f.email.markAsTouched();
      this.f.email.setErrors({'required': true});
    }
  }

}
