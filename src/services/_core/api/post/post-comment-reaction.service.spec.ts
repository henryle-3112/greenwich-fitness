import {TestBed} from '@angular/core/testing';

import {PostCommentReactionService} from './post-comment-reaction.service';

describe('PostCommentReactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostCommentReactionService = TestBed.get(PostCommentReactionService);
    expect(service).toBeTruthy();
  });
});
