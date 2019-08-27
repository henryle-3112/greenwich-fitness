import { PostComment, UserProfile } from '@gw-models/core';

export class ReplyOnPostComment {
  id?: number;
  replyOnPostCommentContent?: string;
  postComment?: PostComment;
  userProfile?: UserProfile;
  replyOnPostCommentStatus?: number;
  numberOfLikes?: number;
  numberOfDislikes?: number;
  isLikeClicked?: boolean;
  replyOnPostCommentCreatedDate?: Date;
  isReacted: boolean;
}
