import { TestBed } from '@angular/core/testing';

import { FacebookAccountService } from './facebook-account.service';

describe('FacebookAccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FacebookAccountService = TestBed.get(FacebookAccountService);
    expect(service).toBeTruthy();
  });
});
