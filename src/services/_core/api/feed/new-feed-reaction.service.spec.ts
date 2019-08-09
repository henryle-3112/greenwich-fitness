import { TestBed } from '@angular/core/testing';

import { NewFeedReactionService } from './new-feed-reaction.service';

describe('NewFeedReactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewFeedReactionService = TestBed.get(NewFeedReactionService);
    expect(service).toBeTruthy();
  });
});
