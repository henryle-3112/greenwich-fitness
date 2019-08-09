import {ReplyOnNewFeedComment, UserProfile} from '@gw-models/core';

export class ReplyOnNewFeedCommentReaction {
  id?: number;
  reaction?: number;
  replyOnNewFeedComment?: ReplyOnNewFeedComment;
  userProfile?: UserProfile;
}
