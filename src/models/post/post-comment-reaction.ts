import {PostComment, UserProfile} from '@gw-models';

export class PostCommentReaction {
  id?: number;
  reaction?: number;
  postComment?: PostComment;
  userProfile?: UserProfile;
}
