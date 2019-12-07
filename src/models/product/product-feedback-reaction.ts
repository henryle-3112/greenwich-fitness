import {ProductFeedback, UserProfile} from '@gw-models';

export class ProductFeedbackReaction {
  id?: number;
  reaction?: number;
  productFeedback?: ProductFeedback;
  userProfile?: UserProfile;
}
