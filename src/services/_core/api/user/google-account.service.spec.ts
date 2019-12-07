import {TestBed} from '@angular/core/testing';

import {GoogleAccountService} from './google-account.service';

describe('GoogleAccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleAccountService = TestBed.get(GoogleAccountService);
    expect(service).toBeTruthy();
  });
});
