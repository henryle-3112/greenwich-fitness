import {UserProfile} from '@gw-models';

export class Coach {
  id?: number;
  userProfile?: UserProfile;
  about?: string;
  status?: number;
  ratingAverage?: number;
  numberOfMemberships?: number;
}
