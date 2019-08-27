import { NewFeed, UserProfile } from '@gw-models/core';

export class NewFeedReaction {
  id?: number;
  reaction?: number;
  newFeed?: NewFeed;
  userProfile?: UserProfile;
}
