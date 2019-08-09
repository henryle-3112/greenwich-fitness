import {ReplyOnPostComment, UserProfile} from '@gw-models/core';

export class ReplyOnPostCommentReaction {
  id?: number;
  reaction?: number;
  replyOnPostComment?: ReplyOnPostComment;
  userProfile: UserProfile;
}
