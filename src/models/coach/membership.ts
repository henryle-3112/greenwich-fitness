import {Coach, UserProfile} from '@gw-models/core';

export class Membership {
  id?: number;
  userProfile?: UserProfile;
  coach?: Coach;
  status?: number;
  startDate?: Date;
}
