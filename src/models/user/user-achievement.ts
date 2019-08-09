import {UserProfile} from '@gw-models/core';

export class UserAchievement {
  achievementId?: number;
  title?: string;
  time?: string;
  userProfile?: UserProfile;
  nreps?: number;
  log?: string;
  currentHealth?: string;
}
