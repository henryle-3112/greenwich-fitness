import { TestBed } from '@angular/core/testing';

import { NewFeedService } from './new-feed.service';

describe('NewFeedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewFeedService = TestBed.get(NewFeedService);
    expect(service).toBeTruthy();
  });
});
