import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {UploadImageService} from '@gw-services/core/api/upload-image/upload-image.service';
import {Router} from '@angular/router';
import {CustomValidator} from '@gw-services/core/validate/custom-validator';
import {FacebookAccount, GoogleAccount, ResponseMessage, UserAccount, UserProfile} from '@gw-models/core';
import {ImageValidator} from '@gw-services/core/validate/image-validator';
import {Observable, Observer} from 'rxjs';
import {AuthenticationService} from '@gw-services/core/authentication/authentication.service';
import {Config} from '@gw-config/core';
import {UserAccountService} from '@gw-services/core/api/user/user-account.service';
import {UserProfileService} from '@gw-services/core/api/user/user-profile.service';
import {ShareUserAccountService} from '@gw-services/core/shared/user-account/share-user-account.service';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})

export class UserInformationComponent implements OnInit {
  // user-account's information form
  userInformationForm: FormGroup;

  // show loading component
  loading = false;

  // avatar url
  avatarUrl: string;

  // check image upload the first time (ignoring nzAction)
  isUploadImage = false;

  // avatar url was returned from the server
  savedAvatarUrl: string;

  // selected user-account's profile
  selectedUserProfile: UserProfile;

  // selected user-account's account
  selectedUserAccount: UserAccount;

  // if user-account login by using facebookAccount
  selectedFacebookAccount: FacebookAccount;

  // if user-account login by googleAccount
  selectedGoogleAccount: GoogleAccount;

  // check login type (login by facebook, google or normal account)
  loginType: string;

  /**
   *
   * @param fb - inject form builder to create user-account's information
   * @param notification - inject notification to show message
   * @param uploadImageService - inject upload's image's service
   * @param router - inject router for routing
   * @param authentication - inject authentication to get current user-account's information
   * @param userAccountService - inject user-account account service to interact user-account's account's data
   * @param userProfileService - inject user-account's profile to interact with user-account's profile's data
   * @param shareUserAccountService - inject share user-account account service to get current user-account's account
   * @param shareUserProfileService - inject share user-account's profile service to get current user-account's profile
   */
  constructor(private fb: FormBuilder,
              private notification: NzNotificationService,
              private uploadImageService: UploadImageService,
              private router: Router,
              private authentication: AuthenticationService,
              private userAccountService: UserAccountService,
              private userProfileService: UserProfileService,
              private shareUserAccountService: ShareUserAccountService,
              private shareUserProfileService: ShareUserProfileService) {
  }

  /**
   * init data
   */
  ngOnInit() {
    // get login type
    this.loginType = localStorage.getItem(Config.loginType);

    // set up validators for register form
    this.userInformationForm = this.fb.group({
      fullName: [null, [Validators.required]],
      userName: [null, [Validators.required, CustomValidator.emailValidator]],
    });
    // set current value to input fields when the form was loaded the first time to avoid null exception
    this.f.userName.setValue('');
    this.f.fullName.setValue('');

    // load current user-account's information ( include user-account's profile and user-account's account )
    this.loadCurrentUserInformation();

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
   * submit user-account's information form
   */
  submitForm(): void {
    // stop here if form is invalid
    if (this.userInformationForm.invalid) {
      this.createNotification('error', 'Error', 'Cannot submit your form! Please check all fields');
      return;
    }
    // show loading component
    this.loading = true;
    // update user-account's name and user-account's fullname
    if (this.loginType.localeCompare('normal') === 0) {
      this.changeNormalAccountInformation();
    }
    // else if (this.loginType.localeCompare('facebook') === 0) {
    //   this.changeFacebookAccountInformation();
    // } else if (this.loginType.localeCompare('google') === 0) {
    //   this.changeGoogleAccountInformation();
    // }
  }

  /**
   * validate email
   */
  validateEmail(): void {
    if (this.f.userName.value.toString().localeCompare('') === 0) {
      this.f.userName.markAsTouched();
      this.f.userName.setErrors({'required': true});
    }
  }

  /**
   * validate name
   */
  validateName(): void {
    if (this.f.fullName.value.toString().localeCompare('') === 0) {
      this.f.fullName.markAsTouched();
      this.f.fullName.setErrors({'required': true});
    }
  }

  /**
   * convenience getter for easy access to form fields
   */
  get f() {
    return this.userInformationForm.controls;
  }


  // change avatar

  /**
   *
   * @param file - uplaod avatar
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
  }

  /**
   *
   * @param info - uploaded file info
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

  /**
   * change normal account information
   */
  private changeNormalAccountInformation() {
    const that = this;
    // show loading component
    this.loading = true;
    // get user-account's name information and fullname's information
    const updatedUserName = this.f.userName.value;
    const updatedFullName = this.f.fullName.value;

    // update user-account's account and user-account's profile
    this.selectedUserAccount.userName = updatedUserName;
    this.selectedUserProfile.fullName = updatedFullName;

    // check updated successfully or not
    let isUpdatedSuccessfully = 0;

    // call api to update user-account's account and call api to update user-account profile
    this.userAccountService.updateUserAccount(this.selectedUserAccount)
      .subscribe((userAccount: UserAccount) => {
        if (userAccount != null) {
          this.selectedUserAccount = userAccount;
          // increase isUpdatedSuccessfully
          isUpdatedSuccessfully += 1;
          // update user-account profile
          this.userProfileService.updateUserProfile(this.selectedUserProfile)
            .subscribe((userProfile: UserProfile) => {
              if (userProfile != null) {
                this.selectedUserProfile = userProfile;
                // hide loading component
                this.loading = false;
                // increase isUpdatedSuccessfully
                isUpdatedSuccessfully += 1;
              }
              if (isUpdatedSuccessfully === 2) {
                // show notification message
                this.createNotification('success', 'Success', 'Your profile was updated successfully');
              } else {
                // show error notification message
                this.createNotification('error', 'Error', 'Failure to update your profile');
              }
            });
        }
      });
  }

  /**
   * change facebook account information
   */
  // private changeFacebookAccountInformation() {
  //
  // }
  //
  // /**
  //  * change google account information
  //  */
  // private changeGoogleAccountInformation() {
  //
  // }

  /**
   * load current user-account's information
   */
  private loadCurrentUserInformation() {
    // load user-account's account
    this.loadUserAccount();
    // load user-account's information
    this.loadUserProfile();
  }

  /**
   * load user-account's account
   */
  private loadUserAccount() {
    this.shareUserAccountService.currentUserAccount
      .subscribe(selectedUserAccount => {
        if (selectedUserAccount) {
          this.selectedUserAccount = selectedUserAccount;
          this.f.userName.setValue(this.selectedUserAccount.userName);
        } else {
          this.router.navigate((['/client']));
        }
      });
  }

  /**
   * load user-account's profile
   */
  private loadUserProfile() {
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.avatarUrl = this.selectedUserProfile.avatar;
          this.f.fullName.setValue(this.selectedUserProfile.fullName);
        } else {
          this.router.navigate(['/client']);
        }
      });
  }
}
