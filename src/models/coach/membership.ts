import {Coach, UserProfile} from '@gw-models';

export class Membership {
  id?: number;
  userProfile?: UserProfile;
  coach?: Coach;
  status?: number;
  startDate?: Date;
}
