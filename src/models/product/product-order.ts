import {UserProfile} from '@gw-models';

export class ProductOrder {
  id?: number;
  productOrderDate?: Date;
  productOrderStatus?: number;
  userProfile?: UserProfile;
}
