import {Product, ReplyOnProductFeedback, UserProfile} from '@gw-models/core';

export class ProductFeedback {
  id?: number;
  feedbackContent?: string;
  feedbackCreatedDate?: Date;
  feedbackStatus?: number;
  userProfile?: UserProfile;
  product?: Product;
  nLikes?: number;
  nDislikes?: number;
  nReplies?: number;
  isLikeClicked?: boolean;
  replies: ReplyOnProductFeedback[];
  isReplyBoxShown?: boolean;
  isReacted?: boolean;
}
