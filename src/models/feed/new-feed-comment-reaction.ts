import {NewFeedComment, UserProfile} from '@gw-models';

export class NewFeedCommentReaction {
  id?: number;
  newFeedComment?: NewFeedComment;
  reaction?: number;
  userProfile?: UserProfile;
}
