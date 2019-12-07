import {Coach, UserProfile} from '@gw-models';

export class CoachRate {
  id?: number;
  rate?: number;
  coach?: Coach;
  userProfile?: UserProfile;
}
