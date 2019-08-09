import {Post, ReplyOnPostComment, UserProfile} from '@gw-models/core';

export class PostComment {
  id?: number;
  postCommentContent?: string;
  post?: Post;
  userProfile?: UserProfile;
  postCommentStatus?: number;
  postCommentCreatedDate?: Date;
  nLikes?: number;
  nDislikes?: number;
  nReplies?: number;
  isLikeClicked?: boolean;
  replies: ReplyOnPostComment[];
  isReplyBoxShown?: boolean;
  isReacted: boolean;
}
