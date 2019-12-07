import {DetailedRounds} from '@gw-models';

export class Workout {
  slug?: string;
  title?: string;
  roundsCount?: number;
  volumeDescription?: string;
  focus?: string;
  smallMobileRetinaPictureUrl?: string;
  largeMobileRetinaPictureUrl?: string;
  detailedRounds: DetailedRounds[];
  neededEquipment?: string;
}
