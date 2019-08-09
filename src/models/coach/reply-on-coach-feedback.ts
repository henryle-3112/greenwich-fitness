import {CoachFeedback, UserProfile} from '@gw-models/core';

export class ReplyOnCoachFeedback {
  id?: number;
  replyOnCoachFeedbackContent?: string;
  replyOnCoachFeedbackCreatedDate?: Date;
  replyOnCoachFeedbackStatus?: number;
  coachFeedback?: CoachFeedback;
  userProfile?: UserProfile;
  nLikes?: number;
  nDislikes?: number;
  isLikeClicked?: boolean;
  isReacted?: boolean;
}
