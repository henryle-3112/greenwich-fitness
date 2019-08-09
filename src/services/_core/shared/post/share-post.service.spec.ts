import { TestBed } from '@angular/core/testing';

import { SharePostService } from './share-post.service';

describe('SharePostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharePostService = TestBed.get(SharePostService);
    expect(service).toBeTruthy();
  });
});
