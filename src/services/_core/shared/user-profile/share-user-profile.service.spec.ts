import { TestBed } from '@angular/core/testing';

import { ShareUserProfileService } from './share-user-profile.service';

describe('ShareUserProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareUserProfileService = TestBed.get(ShareUserProfileService);
    expect(service).toBeTruthy();
  });
});
