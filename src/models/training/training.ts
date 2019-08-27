import { Coach, UserProfile } from '@gw-models/core';

export class Training {
  id?: number;
  userProfile?: UserProfile;
  coach?: Coach;
  status?: number;
  name?: string;
  trainingDate?: string;
  nreps?: number;
  log?: string;
  currentHealth?: string;
  statusButton?: number;
}
