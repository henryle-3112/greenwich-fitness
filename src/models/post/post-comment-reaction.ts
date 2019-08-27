import { PostComment, UserProfile } from '@gw-models/core';

export class PostCommentReaction {
  id?: number;
  reaction?: number;
  postComment?: PostComment;
  userProfile?: UserProfile;
}
