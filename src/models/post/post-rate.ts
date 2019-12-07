import {Post, UserProfile} from '@gw-models';

export class PostRate {
  id?: number;
  rate?: number;
  userProfile?: UserProfile;
  post?: Post;
}
