import { TestBed } from '@angular/core/testing';

import { PostSlideService } from './post-slide.service';

describe('PostSlideService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostSlideService = TestBed.get(PostSlideService);
    expect(service).toBeTruthy();
  });
});
