import { UserProfile } from '@gw-models/core';

export class ChatBotMessage {
  id?: number;
  message?: string;
  userProfile?: UserProfile;
}
