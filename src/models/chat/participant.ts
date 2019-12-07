import {Coach, UserProfile} from '@gw-models';
import {ChatRoom} from './chat-room';

export class Participant {
  id?: number;
  userProfile?: UserProfile;
  coach?: Coach;
  chatRoom?: ChatRoom;
}
