import {GiftType} from '@gw-models';

export class Gift {
  id?: number;
  name?: string;
  point?: number;
  giftType: GiftType;
  image?: string;
}
