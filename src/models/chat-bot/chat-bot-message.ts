import {UserProfile} from '@gw-models';

export class ChatBotMessage {
  id?: number;
  message?: string;
  userProfile?: UserProfile;
}
