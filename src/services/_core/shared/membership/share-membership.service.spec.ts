import { TestBed } from '@angular/core/testing';

import { ShareMembershipService } from './share-membership.service';

describe('ShareMembershipService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareMembershipService = TestBed.get(ShareMembershipService);
    expect(service).toBeTruthy();
  });
});
