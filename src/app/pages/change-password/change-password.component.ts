import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidator } from '@gw-services/core/validate/custom-validator';
import { ResetPasswordService } from '@gw-services/core/api/user/reset-password.service';
import { ResponseMessage, UserAccount } from '@gw-models/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { AuthenticationService } from '@gw-services/core/authentication/authentication.service';
import { Config } from '@gw-config/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  passwordReminderToken: string;
  isLoadingSpinnerShown = false;

  /**
   *
   * @param fb - inject fb
   * @param authenticationService - inject authenticationService
   * @param route - inject route
   * @param router - inject router
   * @param resetPasswordService - inject resetPasswordService
   * @param notification - inject notification
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
  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      confirmPassword: [null, [Validators.required, CustomValidator.passwordValidator]],
      password: [null, [Validators.required, CustomValidator.passwordValidator]]
    });
    this.f.password.setValue('');
    this.f.confirmPassword.setValue('');
    this.passwordReminderToken = this.route.snapshot.queryParams['token'] || '';
    if (this.passwordReminderToken.localeCompare('') === 0) {
      this.router.navigate(['/login']);
    }
  }

  /**
   * convenience getter for easy access to form fields
   */
  get f() {
    return this.changePasswordForm.controls;
  }

  /**
   * submit form
   */
  submitForm(): void {
    if (this.changePasswordForm.invalid) {
      return;
    }
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
    this.isLoadingSpinnerShown = true;
    const changePasswordUrl = `${Config.apiBaseUrl}/${Config.apiUserManagementPrefix}/${Config.apiChangeUserPassword}`;
    this.resetPasswordService.changePassword(changePasswordUrl, updatedUserAccount)
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage.message.localeCompare('success') === 0) {
          this.createNotification('success', 'Success', 'Your password was changed successfully');
        } else {
          this.createNotification('error', 'Error', 'Your password cannot be changed');
        }
        this.authenticationService.logout();
        this.router.navigate(['/login']);
        this.isLoadingSpinnerShown = false;
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
   * validate password
   */
  validatePassword(): void {
    if (this.f.password.value.toString().localeCompare('') === 0) {
      this.f.password.markAsTouched();
      this.f.password.setErrors({ 'required': true });
    }
  }

  /**
   * validate confirm password
   */
  validateConfirmPassword(): void {
    if (this.f.confirmPassword.value.toString().localeCompare(this.f.password.value) !== 0) {
      this.f.confirmPassword.markAsTouched();
      this.f.confirmPassword.setErrors({ 'required': true });
    } else {
      this.f.confirmPassword.setErrors(null);
    }
  }
}
