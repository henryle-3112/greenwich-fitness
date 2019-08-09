import {NewFeedComment, UserProfile} from '@gw-models/core';

export class NewFeedCommentReaction {
  id?: number;
  newFeedComment?: NewFeedComment;
  reaction?: number;
  userProfile?: UserProfile;
}
