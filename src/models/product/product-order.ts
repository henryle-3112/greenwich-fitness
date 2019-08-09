import {UserProfile} from '@gw-models/core';

export class ProductOrder {
  id?: number;
  productOrderDate?: Date;
  productOrderStatus?: number;
  userProfile?: UserProfile;
}
