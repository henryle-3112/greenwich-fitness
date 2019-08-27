import { Product, UserProfile } from '@gw-models/core';

export class ProductRate {
  id?: number;
  rate?: number;
  product?: Product;
  userProfile?: UserProfile;
}
