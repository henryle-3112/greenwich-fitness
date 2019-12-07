import {TestBed} from '@angular/core/testing';

import {ReplyOnPostCommentReactionService} from './reply-on-post-comment-reaction.service';

describe('ReplyOnPostCommentReactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReplyOnPostCommentReactionService = TestBed.get(ReplyOnPostCommentReactionService);
    expect(service).toBeTruthy();
  });
});
