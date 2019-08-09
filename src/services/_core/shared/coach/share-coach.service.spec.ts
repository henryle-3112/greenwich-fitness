import { TestBed } from '@angular/core/testing';

import { ShareCoachService } from './share-coach.service';

describe('ShareCoachService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareCoachService = TestBed.get(ShareCoachService);
    expect(service).toBeTruthy();
  });
});
