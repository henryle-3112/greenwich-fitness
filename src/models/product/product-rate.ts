import {Product, UserProfile} from '@gw-models';

export class ProductRate {
  id?: number;
  rate?: number;
  product?: Product;
  userProfile?: UserProfile;
}
