import {ChatRoom} from './chat-room';
import {UserProfile} from '@gw-models';

export class ChatMessage {
  id?: number;
  userProfile?: UserProfile;
  chatRoom?: ChatRoom;
  message?: string;
}
