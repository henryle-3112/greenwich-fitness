import {ReplyOnProductFeedback, UserProfile} from '@gw-models';

export class ReplyOnProductFeedbackReaction {
  id?: number;
  reaction?: number;
  replyOnProductFeedback: ReplyOnProductFeedback;
  userProfile: UserProfile;
}
