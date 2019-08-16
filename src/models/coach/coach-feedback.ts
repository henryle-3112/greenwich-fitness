import {Coach, ReplyOnCoachFeedback, UserProfile} from '@gw-models/core';

export class CoachFeedback {
  id?: number;
  userProfile?: UserProfile;
  coach?: Coach;
  coachFeedbackContent?: string;
  coachFeedbackCreatedDate?: Date;
  coachFeedbackStatus?: number;
  numberOfLikes?: number;
  numberOfDislikes?: number;
  numberOfReplies?: number;
  isLikeClicked?: boolean;
  replies: ReplyOnCoachFeedback[];
  isReplyBoxShown?: boolean;
  isReacted?: boolean;
}
