import {ProductOrder} from '@gw-models';

export class ProductPayment {
  id?: number;
  paymentId?: string;
  payerId?: string;
  token?: string;
  productOrder?: ProductOrder;
  createdDate?: Date;
}
