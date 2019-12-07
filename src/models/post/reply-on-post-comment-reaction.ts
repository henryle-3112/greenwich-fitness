import {ReplyOnPostComment, UserProfile} from '@gw-models';

export class ReplyOnPostCommentReaction {
  id?: number;
  reaction?: number;
  replyOnPostComment?: ReplyOnPostComment;
  userProfile: UserProfile;
}
