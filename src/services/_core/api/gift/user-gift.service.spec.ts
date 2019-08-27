import { TestBed } from '@angular/core/testing';

import { UserGiftService } from './user-gift.service';

describe('UserGiftService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserGiftService = TestBed.get(UserGiftService);
    expect(service).toBeTruthy();
  });
});
