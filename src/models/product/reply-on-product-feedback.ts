import {ProductFeedback, UserProfile} from '@gw-models/core';

export class ReplyOnProductFeedback {
  id?: number;
  replyOnProductFeedbackContent?: string;
  replyOnProductFeedbackStatus?: number;
  replyOnProductFeedbackCreateDate?: Date;
  productFeedback: ProductFeedback;
  userProfile: UserProfile;
  nLikes?: number;
  nDislikes?: number;
  isLikeClicked?: boolean;
  isReacted?: boolean;
}
