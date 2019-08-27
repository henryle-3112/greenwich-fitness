import { ReplyOnCoachFeedback, UserProfile } from '@gw-models/core';

export class ReplyOnCoachFeedbackReaction {
  id?: number;
  replyOnCoachFeedback?: ReplyOnCoachFeedback;
  reaction?: number;
  userProfile?: UserProfile;
}
