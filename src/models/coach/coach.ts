import {UserProfile} from '@gw-models/core';

export class Coach {
  id?: number;
  userProfile?: UserProfile;
  about?: string;
  status?: number;
  ratingAverage?: number;
  numberOfMemberships?: number;
}
