import { TestBed } from '@angular/core/testing';

import { ShareUserAccountService } from './share-user-account.service';

describe('ShareUserAccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareUserAccountService = TestBed.get(ShareUserAccountService);
    expect(service).toBeTruthy();
  });
});
