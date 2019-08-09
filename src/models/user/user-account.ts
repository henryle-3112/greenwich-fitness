import { UserAccountStatus } from './user-account-status';
import { UserProfile } from './user-profile';
export class UserAccount {
  userName?: string;
  password?: string;
  passwordReminderToken?: string;
  passwordReminderExpired?: Date;
  emailConfirmationToken?: string;
  userProfile: UserProfile;
  userAccountStatus: UserAccountStatus;
  registrationTime?: Date;
}
