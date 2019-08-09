import {UserProfile} from '@gw-models/core';

export class Notification {
  id?: number;
  content?: string;
  userProfile?: UserProfile;
  createdDate?: Date;
  status?: number;
}
