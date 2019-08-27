import { PostCategory, UserProfile } from '@gw-models/core';

export class Post {
  id?: number;
  postContent?: string;
  // postDescription?: string;
  // postMetaKeywords?: string;
  postTitle?: string;
  postImage?: string;
  // postCreatedDate?: Date;
  // postModifiedDate?: Date;
  // postStatus?: number;
  postCategory?: PostCategory;
  postMetaTitle?: string;
  // postMetaDescription?: string;
  userProfile?: UserProfile;
  // postViewCount?: number;
  // postTopHot?: number;
  // postNew?: number;
}
