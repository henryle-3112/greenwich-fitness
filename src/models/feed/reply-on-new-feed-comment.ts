import {NewFeedComment, UserProfile} from '@gw-models/core';

export class ReplyOnNewFeedComment {
  id?: number;
  replyOnNewFeedCommentContent?: string;
  newFeedComment?: NewFeedComment;
  userProfile?: UserProfile;
  replyOnNewFeedCommentStatus?: number;
  replyOnNewFeedCommentCreatedDate?: Date;
  numberOfLikes?: number;
  numberOfDislikes?: number;
  isLikeClicked?: boolean;
  isReacted: boolean;
}
