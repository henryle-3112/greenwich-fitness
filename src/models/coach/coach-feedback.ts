import {Coach, ReplyOnProductFeedback, UserProfile} from '@gw-models/core';

export class CoachFeedback {
  id?: number;
  userProfile?: UserProfile;
  coach?: Coach;
  coachFeedbackContent?: string;
  coachFeedbackCreatedDate?: Date;
  coachFeedbackStatus?: number;
  nLikes?: number;
  nDislikes?: number;
  nReplies?: number;
  isLikeClicked?: boolean;
  replies: ReplyOnProductFeedback[];
  isReplyBoxShown?: boolean;
  isReacted?: boolean;
}
