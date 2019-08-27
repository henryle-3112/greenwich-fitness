import { GiftType } from '@gw-models/core';

export class Gift {
  id?: number;
  name?: string;
  point?: number;
  giftType: GiftType;
  image?: string;
}
