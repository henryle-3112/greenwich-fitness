import {ProductFeedback, UserProfile} from '@gw-models/core';

export class ProductFeedbackReaction {
  id?: number;
  reaction?: number;
  productFeedback?: ProductFeedback;
  userProfile?: UserProfile;
}
