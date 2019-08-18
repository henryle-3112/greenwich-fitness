import {Router} from '@angular/router';
import {SignupService} from '@gw-services/core/api/user/signup.service';
import {ResponseMessage, UserAccount, UserProfile} from '@gw-models/core';
import {UploadImageService} from '@gw-services/core/api/upload-image/upload-image.service';
import {ImageValidator} from '@gw-services/core/validate/image-validator';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidator} from '@gw-services/core/validate/custom-validator';
import {NzNotificationService} from 'ng-zorro-antd';
import {Observable, Observer} from 'rxjs';
import {UserAccountStatus} from 'src/models/user/user-account-status';
import {Config} from '@gw-config/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoadingSpinnerShown = false;
  avatarUrl: string;
  savedAvatarUrl: string;

  /**
   *
   * @param fb - inject fb
   * @param notification - inject notification
   * @param uploadImageService - inject uploadImageService
   * @param signUpService - inject signUpService
   * @param router - inject router
   */
  constructor(private fb: FormBuilder,
              private notification: NzNotificationService,
              private uploadImageService: UploadImageService,
              private signUpService: SignupService,
              private router: Router) {
  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: [null, [Validators.required]],
      userName: [null, [Validators.required, CustomValidator.emailValidator]],
      password: [null, [Validators.required, CustomValidator.passwordValidator]],
      confirmPassword: [null, [Validators.required, CustomValidator.passwordValidator]],
      acceptTermsOfService: [true]
    });
    this.f.userName.setValue('');
    this.f.fullName.setValue('');
    this.f.password.setValue('');
    this.f.confirmPassword.setValue('');
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
   * convenience getter for easy access to form fields
   */
  get f() {
    return this.registerForm.controls;
  }

  /**
   * submit login form
   */
  submitForm(): void {
    if (this.registerForm.invalid) {
      this.createNotification('error', 'Error', 'Cannot submit your form! Please check all fields');
      return;
    }
    this.isLoadingSpinnerShown = true;
    const userAccountStatus = this.createUserAccountStatus();
    const userProfile = this.createUserProfile();
    const newUserAccount = this.createUserAccount(userAccountStatus, userProfile);
    const signUpUrl = `${Config.apiBaseUrl}/${Config.apiUserManagementPrefix}/${Config.apiRegister}`;
    this.signUpService.signUp(signUpUrl, newUserAccount).subscribe(
      (responseMessage: ResponseMessage) => {
        if (responseMessage.message.localeCompare('successfully') === 0) {
          this.router.navigate(['/email-verify']);
        } else {
          this.createNotification('error', 'Error', 'Cannot create your account! Please try again! Your user-account\'s may be existed');
        }
        this.isLoadingSpinnerShown = false;
      }
    );
  }

  /**
   * create user account's status
   */
  private createUserAccountStatus(): UserAccountStatus {
    const userAccountStatus = new UserAccountStatus();
    userAccountStatus.id = 2;
    userAccountStatus.name = 'EMAIL_NOT_CONFIRMED';
    return userAccountStatus;
  }

  /**
   * create user profile
   */
  private createUserProfile(): UserProfile {
    const userProfile = new UserProfile();
    userProfile.fullName = this.f.fullName.value;
    userProfile.acceptTermsOfService = 1;
    userProfile.avatar = this.savedAvatarUrl;
    userProfile.status = 1;
    return userProfile;
  }

  /**
   *
   * @param userAccountStatus - user's account's status that will be set to user's account
   * @param userProfile - user's profile that will be set to user's account
   */
  private createUserAccount(userAccountStatus: UserAccountStatus, userProfile: UserProfile) {
    const userAccount = new UserAccount();
    userAccount.userName = this.f.userName.value;
    userAccount.password = this.f.password.value;
    userAccount.userAccountStatus = userAccountStatus;
    userAccount.userProfile = userProfile;
    return userAccount;
  }

  /**
   * validate password when user-account blured password field
   */
  validatePassword(): void {
    if (this.f.password.value.toString().localeCompare('') === 0) {
      this.f.password.markAsTouched();
      this.f.password.setErrors({'required': true});
    }
  }

  /**
   * validate email when user-account blured email field
   */
  validateEmail(): void {
    if (this.f.userName.value.toString().localeCompare('') === 0) {
      this.f.userName.markAsTouched();
      this.f.userName.setErrors({'required': true});
    }
  }

  /**
   * validate name when user-account blured name field
   */
  validateName(): void {
    if (this.f.fullName.value.toString().localeCompare('') === 0) {
      this.f.fullName.markAsTouched();
      this.f.fullName.setErrors({'required': true});
    }
  }

  /**
   * validate confirm password when user-account blured confirm password field
   */
  validateConfirmPassword(): void {
    if (this.f.confirmPassword.value.toString().localeCompare('') === 0) {
      this.f.confirmPassword.markAsTouched();
      this.f.confirmPassword.setErrors({'required': true});
    }
  }

  /**
   * check keyup to validate confirm password
   */
  checkKeyUpValidateConfirmPassword(): void {
    if (this.f.confirmPassword.value.toString().localeCompare(this.f.password.value.toString()) !== 0) {
      this.f.confirmPassword.markAsTouched();
      this.f.confirmPassword.setErrors({'required': true});
    } else {
      this.f.confirmPassword.setErrors(null);
    }
  }

  /**
   *
   * @param file - file to upload to server
   */
  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.createNotification('error', 'Error', 'You cannot upload JPG file');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.createNotification('error', 'Error', 'Your image size must be smaller than 2MB');
        observer.complete();
        return;
      }
      // check height
      ImageValidator.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.createNotification('error', 'Error', 'Image only 300x300 above');
          observer.complete();
          return;
        }
        if (isJPG && isLt2M && dimensionRes) {
          this.uploadUserAvatarToServer(file);
        }
      });
    });
  }

  /**
   * update user avatar to server
   */
  private uploadUserAvatarToServer(file: File): void {
    this.isLoadingSpinnerShown = true;
    const formData = new FormData();
    formData.append('file', file);
    const uploadRootLocation = 'user';
    const uploadFileUrl = `${Config.apiBaseUrl}/${Config.apiUploadManagementPrefix}/${Config.apiUploads}/${uploadRootLocation}`;
    this.uploadImageService.uploadFile(uploadFileUrl, formData).subscribe(
      (responseMessage: ResponseMessage) => {
        if (responseMessage && responseMessage.message.localeCompare('failure') !== 0) {
          this.savedAvatarUrl = responseMessage.message;
          this.createNotification('success', 'Success', 'Your avatar was uploaded successfully');
        } else if (responseMessage && responseMessage.message.localeCompare('failure') === 0) {
          this.createNotification('error', 'Error', 'Cannot upload your avatar! Please try again!');
        }
        ImageValidator.getBase64(file, (img: string) => {
          this.isLoadingSpinnerShown = false;
          this.avatarUrl = img;
        });
      }
    );
  }
}
