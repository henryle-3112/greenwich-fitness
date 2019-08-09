import { TestBed } from '@angular/core/testing';

import { ReplyOnNewFeedCommentReactionService } from './reply-on-new-feed-comment-reaction.service';

describe('ReplyOnNewFeedCommentReactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReplyOnNewFeedCommentReactionService = TestBed.get(ReplyOnNewFeedCommentReactionService);
    expect(service).toBeTruthy();
  });
});
