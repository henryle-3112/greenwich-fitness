import { TestBed } from '@angular/core/testing';

import { ReplyOnNewFeedCommentService } from './reply-on-new-feed-comment.service';

describe('ReplyOnNewFeedCommentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReplyOnNewFeedCommentService = TestBed.get(ReplyOnNewFeedCommentService);
    expect(service).toBeTruthy();
  });
});
