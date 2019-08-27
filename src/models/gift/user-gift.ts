import { Gift, UserProfile } from '@gw-models/core';

export class UserGift {
  id?: number;
  status?: number;
  gift?: Gift;
  userProfile?: UserProfile;
}
