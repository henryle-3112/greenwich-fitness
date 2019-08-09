import { TestBed } from '@angular/core/testing';

import { ReplyOnPostCommentService } from './reply-on-post-comment.service';

describe('ReplyOnPostCommentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReplyOnPostCommentService = TestBed.get(ReplyOnPostCommentService);
    expect(service).toBeTruthy();
  });
});
