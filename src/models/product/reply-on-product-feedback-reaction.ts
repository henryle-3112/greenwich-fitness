import { ReplyOnProductFeedback, UserProfile } from '@gw-models/core';

export class ReplyOnProductFeedbackReaction {
  id?: number;
  reaction?: number;
  replyOnProductFeedback: ReplyOnProductFeedback;
  userProfile: UserProfile;
}
