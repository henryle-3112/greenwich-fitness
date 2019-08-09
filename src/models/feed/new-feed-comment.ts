import {NewFeed, ReplyOnNewFeedComment, UserProfile} from '@gw-models/core';

export class NewFeedComment {
  id?: number;
  newFeedCommentContent?: string;
  newFeedCommentCreatedDate?: Date;
  newFeed?: NewFeed;
  userProfile?: UserProfile;
  newFeedCommentStatus?: number;
  //
  nLikes?: number;
  nDislikes?: number;
  nReplies?: number;
  isLikeClicked?: boolean;
  replies: ReplyOnNewFeedComment[];
  isReplyBoxShown?: boolean;
}
