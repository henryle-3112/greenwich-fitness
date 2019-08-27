import { NewFeed, ReplyOnNewFeedComment, UserProfile } from '@gw-models/core';

export class NewFeedComment {
  id?: number;
  newFeedCommentContent?: string;
  newFeedCommentCreatedDate?: Date;
  newFeed?: NewFeed;
  userProfile?: UserProfile;
  newFeedCommentStatus?: number;
  numberOfLikes?: number;
  numberOfDislikes?: number;
  numberOfReplies?: number;
  isLikeClicked?: boolean;
  replies: ReplyOnNewFeedComment[];
  isReplyBoxShown?: boolean;
  isReacted: boolean;
}
