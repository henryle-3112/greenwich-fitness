import {Membership} from '@gw-models';

export class CoachPayment {
  id?: number;
  paymentId?: string;
  payerId?: string;
  token?: string;
  membership?: Membership;
  createdDate?: Date;
  sum?: number;
}
