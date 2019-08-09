import { TestBed } from '@angular/core/testing';

import { NewFeedCommentReactionService } from './new-feed-comment-reaction.service';

describe('NewFeedCommentReactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewFeedCommentReactionService = TestBed.get(NewFeedCommentReactionService);
    expect(service).toBeTruthy();
  });
});
