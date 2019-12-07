import {TestBed} from '@angular/core/testing';

import {PostTagService} from './post-tag.service';

describe('PostTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostTagService = TestBed.get(PostTagService);
    expect(service).toBeTruthy();
  });
});
