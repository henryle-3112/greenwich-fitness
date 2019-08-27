import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '@gw-services/core/validate/custom-validator';
import { ResetPasswordService } from '@gw-services/core/api/user/reset-password.service';
import { ResponseMessage } from '@gw-models/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { Config } from '@gw-config/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  isLoadingSpinnerShown = false;

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
    this.forgotPasswordForm = this.fb.group({
      email: [null, [Validators.required, CustomValidator.emailValidator]]
    });
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
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.isLoadingSpinnerShown = true;
    const sendEmailResetPasswordUrl = `${Config.apiBaseUrl}/${Config.apiUserManagementPrefix}/${Config.apiSendEmailResetPassword}`;
    this.resetPasswordService.sendEmailToResetPassword(sendEmailResetPasswordUrl, this.f.email.value.toString())
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage.message.localeCompare('success') === 0) {
          this.createNotification('success', 'Successfully', 'Email was sent successfully, if you do not see the email, please try again!');
          this.router.navigate(['/login']);
        } else {
          this.createNotification('error', 'Error', 'Email cannot be sent. Please try again!');
        }
        this.isLoadingSpinnerShown = false;
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
      this.f.email.setErrors({ 'required': true });
    }
  }

}
