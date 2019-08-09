import {CoachFeedback, UserProfile} from '@gw-models/core';

export class CoachFeedbackReaction {
  id?: number;
  reaction?: number;
  coachFeedback?: CoachFeedback;
  userProfile?: UserProfile;
}
