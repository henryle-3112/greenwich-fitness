import {Product, ReplyOnProductFeedback, UserProfile} from '@gw-models';

export class ProductFeedback {
  id?: number;
  feedbackContent?: string;
  feedbackCreatedDate?: Date;
  feedbackStatus?: number;
  userProfile?: UserProfile;
  product?: Product;
  numberOfLikes?: number;
  numberOfDislikes?: number;
  numberOfReplies?: number;
  isLikeClicked?: boolean;
  replies: ReplyOnProductFeedback[];
  isReplyBoxShown?: boolean;
  isReacted?: boolean;
}
