import { TestBed } from '@angular/core/testing';

import { PostRateService } from './post-rate.service';

describe('PostRateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostRateService = TestBed.get(PostRateService);
    expect(service).toBeTruthy();
  });
});
