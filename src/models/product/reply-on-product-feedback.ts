import {ProductFeedback, UserProfile} from '@gw-models/core';

export class ReplyOnProductFeedback {
  id?: number;
  replyOnProductFeedbackContent?: string;
  replyOnProductFeedbackStatus?: number;
  replyOnProductFeedbackCreateDate?: Date;
  productFeedback: ProductFeedback;
  userProfile: UserProfile;
  numberOfLikes?: number;
  numberOfDislikes?: number;
  isLikeClicked?: boolean;
  isReacted?: boolean;
}
