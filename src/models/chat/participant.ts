import { UserProfile, Coach } from '@gw-models/core';
import { ChatRoom } from './chat-room';

export class Participant {
  id?: number;
  userProfile?: UserProfile;
  coach?: Coach;
  chatRoom?: ChatRoom;
}
