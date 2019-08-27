import { Post, UserProfile } from '@gw-models/core';

export class PostRate {
  id?: number;
  rate?: number;
  userProfile?: UserProfile;
  post?: Post;
}
