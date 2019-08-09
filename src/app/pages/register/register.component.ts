import {Router} from '@angular/router';
import {SignupService} from '@gw-services/core/api/user/signup.service';
import {ResponseMessage, UserAccount, UserProfile} from '@gw-models/core';
import {UploadImageService} from '@gw-services/core/api/upload-image/upload-image.service';
import {ImageValidator} from '@gw-services/core/validate/image-validator';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidator} from '@gw-services/core/validate/custom-validator';
import {NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {Observable, Observer} from 'rxjs';
import {UserAccountStatus} from 'src/models/user/user-account-status';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // register form
  registerForm: FormGroup;
  // check loading component is showing or not
  loading = false;
  // avatar url
  avatarUrl: string;
  // check image upload the first time (ignoring nzAction)
  isUploadImage = false;
  // avatar url was returned from the server
  savedAvatarUrl: string;

  /**
   *
   * @param fb - inject form builder to create register form
   * @param notification - inject notification to show message
   * @param uploadImageService - inject upload image service to upload image
   * @param signUpService - inject sign up service to register
   * @param router - inject router for routing
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
  ngOnInit() {
    // set up validators for register form
    this.registerForm = this.fb.group({
      fullName: [null, [Validators.required]],
      userName: [null, [Validators.required, CustomValidator.emailValidator]],
      password: [null, [Validators.required, CustomValidator.passwordValidator]],
      confirmPassword: [null, [Validators.required, CustomValidator.passwordValidator]],
      acceptTermsOfService: [true]
    });
    // set current value to input fields when the form was loaded the first time to avoid null exception
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
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      this.createNotification('error', 'Error', 'Cannot submit your form! Please check all fields');
      return;
    }
    this.loading = true;
    // create user-account's account's status for new account
    // default is EMAIL_NOT_CONFIRMED
    const userAccountStatus = new UserAccountStatus();
    userAccountStatus.id = 2;
    userAccountStatus.name = 'EMAIL_NOT_CONFIRMED';
    // create user-account's profile to save user-account's profile's information
    const userProfile = new UserProfile();
    userProfile.fullName = this.f.fullName.value;
    userProfile.acceptTermsOfService = 1;
    userProfile.avatar = this.savedAvatarUrl;
    userProfile.status = 1;
    // get user-account's account's information to submit to the server
    const newUserAccount = new UserAccount();
    newUserAccount.userName = this.f.userName.value;
    newUserAccount.password = this.f.password.value;
    newUserAccount.userAccountStatus = userAccountStatus;
    newUserAccount.userProfile = userProfile;
    // submit new user-account's account to the server
    this.signUpService.signUp(newUserAccount).subscribe(
      (responseMessage: ResponseMessage) => {
        if (responseMessage.message.localeCompare('successfully') === 0) {
          // redirect to the alert message page
          this.router.navigate(['/email-verify']);
        } else {
          // show error message to user-account
          this.createNotification('error', 'Error', 'Cannot create your account! Please try again! Your user-account\'s may be existed');
        }
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

        observer.next(isJPG && isLt2M && dimensionRes);
        observer.complete();
      });
    });
  };

  /**
   *
   * @param info - file info
   */
  handleChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        const formData = new FormData();
        formData.append('file', info.file.originFileObj);
        // if image was not uploaded
        if (!this.isUploadImage) {
          this.uploadImageService.uploadImage(formData, 'user').subscribe(
            (responseMessage: ResponseMessage) => {
              if (responseMessage.message.localeCompare('failure') !== 0) {
                // save image url that was returned from the server
                this.savedAvatarUrl = responseMessage.message;
                // show successfull notification to users
                this.createNotification('success', 'Success', 'Your avatar was uploaded successfully');
              } else if (responseMessage.message.localeCompare('failure') === 0) {
                // if the image cannot be uploaded to the server. show notification to users
                this.createNotification('error', 'Error', 'Cannot upload your avatar! Please try again!');
              }
              ImageValidator.getBase64(info.file.originFileObj, (img: string) => {
                this.loading = false;
                this.avatarUrl = img;
              });
            }
          );
          this.isUploadImage = true;
        }
        break;
    }
  }
}
