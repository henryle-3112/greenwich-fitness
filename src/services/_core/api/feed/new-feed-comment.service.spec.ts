import { TestBed } from '@angular/core/testing';

import { NewFeedCommentService } from './new-feed-comment.service';

describe('NewFeedCommentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewFeedCommentService = TestBed.get(NewFeedCommentService);
    expect(service).toBeTruthy();
  });
});
