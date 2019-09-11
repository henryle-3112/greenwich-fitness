import { TestBed } from '@angular/core/testing';

import { ChatBotService } from './chat-bot.service';

describe('ChatBotService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatBotService = TestBed.get(ChatBotService);
    expect(service).toBeTruthy();
  });
});
