import {CoachFeedback, UserProfile} from '@gw-models';

export class CoachFeedbackReaction {
  id?: number;
  reaction?: number;
  coachFeedback?: CoachFeedback;
  userProfile?: UserProfile;
}
