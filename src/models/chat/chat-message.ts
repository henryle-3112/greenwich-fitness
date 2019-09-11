import { ChatRoom } from './chat-room';
import { UserProfile } from './../user/user-profile';
export class ChatMessage {
  id?: number;
  userProfile?: UserProfile;
  chatRoom?: ChatRoom;
  message?: string;
}
