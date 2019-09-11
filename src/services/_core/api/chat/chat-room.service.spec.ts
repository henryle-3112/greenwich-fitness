import { TestBed } from '@angular/core/testing';

import { ChatRoomService } from './chat-room.service';

describe('ChatRoomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatRoomService = TestBed.get(ChatRoomService);
    expect(service).toBeTruthy();
  });
});
