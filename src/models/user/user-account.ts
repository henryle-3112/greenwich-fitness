import {UserAccountStatus, UserProfile} from '@gw-models';

export class UserAccount {
  userName?: string;
  password?: string;
  passwordReminderToken?: string;
  // passwordReminderExpired?: Date;
  emailConfirmationToken?: string;
  userProfile: UserProfile;
  userAccountStatus: UserAccountStatus;
  // registrationTime?: Date;
}
