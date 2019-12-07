import {ReplyOnNewFeedComment, UserProfile} from '@gw-models';

export class ReplyOnNewFeedCommentReaction {
  id?: number;
  reaction?: number;
  replyOnNewFeedComment?: ReplyOnNewFeedComment;
  userProfile?: UserProfile;
}
