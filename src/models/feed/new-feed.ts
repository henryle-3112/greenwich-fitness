import {NewFeedComment, UserProfile} from '@gw-models/core';

export class NewFeed {
  id?: number;
  image?: string;
  achievement?: string;
  achievementTime?: string;
  content?: string;
  status: number;
  createdDate?: Date;
  userProfile: UserProfile;
  numberOfLikes?: number;
  numberOfDislikes?: number;
  numberOfComments?: number;
  isLikeClicked?: boolean;
  replies: NewFeedComment[];
  isReplyBoxShown?: boolean;
  isReacted?: boolean;
}
