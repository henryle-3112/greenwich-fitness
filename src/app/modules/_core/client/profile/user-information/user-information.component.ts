import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzNotificationService} from 'ng-zorro-antd';
import {UploadImageService} from '@gw-services/core/api/upload-image/upload-image.service';
import {Router} from '@angular/router';
import {ResponseMessage, UserAccount, UserProfile} from '@gw-models/core';
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
  userInformationForm: FormGroup;
  isLoadingSpinnerShown = false;
  avatarUrl: string;
  savedAvatarUrl: string;
  selectedUserProfile: UserProfile;
  selectedUserAccount: UserAccount;
  // check login type (login by facebook, google or normal account)
  loginType: string;

  /**
   *
   * @param fb - inject fb
   * @param notification - inject notification
   * @param uploadImageService - inject uploadImageService
   * @param router - inject router
   * @param authentication - inject authentication
   * @param userAccountService - inject userAccountService
   * @param userProfileService - inject userProfileService
   * @param shareUserAccountService - inject shareUserAccountService
   * @param shareUserProfileService - inject shareUserProfileService
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
    this.loginType = localStorage.getItem(Config.loginType);
    this.userInformationForm = this.fb.group({
      fullName: [null, [Validators.required]]
    });
    this.f.fullName.setValue('');
    this.getCurrentUserInformation();

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
    if (this.userInformationForm.invalid) {
      this.createNotification('error', 'Error', 'Cannot submit your form! Please check all fields');
      return;
    }
    this.isLoadingSpinnerShown = true;
    if (this.loginType.localeCompare('normal') === 0) {
      this.changeNormalAccountInformation();
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

  /**
   *
   * @param file - upload avatar
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
          this.updateUserAvatarToServer(file);
        }
      });
    });
  }

  /**
   *
   *
   * @param file - user's avatar that user want to update
   */
  private updateUserAvatarToServer(file: File) {
    this.isLoadingSpinnerShown = true;
    const formData = new FormData();
    formData.append('file', file);
    const uploadRootLocation = 'user';
    const uploadFileUrl = `${Config.apiBaseUrl}/${Config.apiUploadManagementPrefix}/${Config.apiUploads}/${uploadRootLocation}`;
    this.uploadImageService.uploadFile(uploadFileUrl, formData).subscribe(
      (responseMessage: ResponseMessage) => {
        if (responseMessage.message.localeCompare('failure') !== 0) {
          this.savedAvatarUrl = responseMessage.message;
          this.selectedUserProfile.avatar = this.savedAvatarUrl;
          this.createNotification('success', 'Success', 'Your avatar was uploaded successfully');
        } else if (responseMessage.message.localeCompare('failure') === 0) {
          this.createNotification('error', 'Error', 'Cannot upload your avatar! Please try again!');
        }
        ImageValidator.getBase64(file, (img: string) => {
          this.isLoadingSpinnerShown = false;
          this.avatarUrl = img;
        });
      }
    );
  }

  /**
   * change normal account information
   */
  private changeNormalAccountInformation() {
    this.isLoadingSpinnerShown = true;
    this.selectedUserProfile.fullName = this.f.fullName.value;
    const updateUserAccountUrl = `${Config.apiBaseUrl}/${Config.apiUserManagementPrefix}/${Config.apiUserAccounts}`;
    this.userAccountService.updateUserAccount(updateUserAccountUrl, this.selectedUserAccount)
      .subscribe((userAccount: UserAccount) => {
        if (userAccount != null) {
          this.selectedUserAccount = userAccount;
          this.updateUserProfile();
        }
      });
  }

  /**
   * update user's profile
   */
  private updateUserProfile() {
    const updateUserProfileUrl = `${Config.apiBaseUrl}/${Config.apiUserManagementPrefix}/${Config.apiUserProfiles}`;
    this.userProfileService.updateUserProfile(updateUserProfileUrl, this.selectedUserProfile)
      .subscribe((userProfile: UserProfile) => {
        if (userProfile != null) {
          this.selectedUserProfile = userProfile;
          this.isLoadingSpinnerShown = false;
          this.createNotification('success', 'Success', 'Your profile was updated successfully');
        } else {
          this.createNotification('error', 'Error', 'Failure to update your profile');
        }
      });
  }

  /**
   * load current user-account's information
   */
  private getCurrentUserInformation() {
    this.getUserAccount();
    this.getUserProfile();
  }

  /**
   * load user-account's account
   */
  private getUserAccount() {
    this.shareUserAccountService.currentUserAccount
      .subscribe(selectedUserAccount => {
        if (selectedUserAccount) {
          this.selectedUserAccount = selectedUserAccount;
        } else {
          this.router.navigate((['/client']));
        }
      });
  }

  /**
   * load user-account's profile
   */
  private getUserProfile() {
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
