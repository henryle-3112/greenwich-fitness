import {Coach, UserProfile} from '@gw-models/core';

export class CoachRate {
  id?: number;
  rate?: number;
  coach?: Coach;
  userProfile?: UserProfile;
}
