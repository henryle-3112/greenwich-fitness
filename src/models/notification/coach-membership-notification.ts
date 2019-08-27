import { Coach, UserProfile } from '@gw-models/core';

export class CoachMembershipNotification {
  id?: number;
  content?: string;
  userProfile?: UserProfile;
  coach?: Coach;
  status?: number;
  createdDate?: Date;
}
