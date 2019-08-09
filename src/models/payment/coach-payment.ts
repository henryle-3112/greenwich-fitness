import {Membership} from '@gw-models/core';

export class CoachPayment {
  id?: number;
  paymentId?: string;
  payerId?: string;
  token?: string;
  membership?: Membership;
  createdDate?: Date;
  sum?: number;
}
