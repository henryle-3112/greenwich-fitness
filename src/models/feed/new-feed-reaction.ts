import {NewFeed, UserProfile} from '@gw-models';

export class NewFeedReaction {
  id?: number;
  reaction?: number;
  newFeed?: NewFeed;
  userProfile?: UserProfile;
}
