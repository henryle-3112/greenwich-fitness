import { UserProfile } from '@gw-models/core';

export class Gallery {
  id?: number;
  image?: string;
  title?: string;
  createDate?: Date;
  modifiedDate?: Date;
  status?: number;
  thumbnail?: string;
  userProfile?: UserProfile;
}
