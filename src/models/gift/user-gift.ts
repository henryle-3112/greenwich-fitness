import {Gift, UserProfile} from '@gw-models';

export class UserGift {
  id?: number;
  status?: number;
  gift?: Gift;
  userProfile?: UserProfile;
}
