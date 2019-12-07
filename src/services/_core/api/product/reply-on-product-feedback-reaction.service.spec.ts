import {TestBed} from '@angular/core/testing';

import {ReplyOnProductFeedbackReactionService} from './reply-on-product-feedback-reaction.service';

describe('ReplyOnProductFeedbackReactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReplyOnProductFeedbackReactionService = TestBed.get(ReplyOnProductFeedbackReactionService);
    expect(service).toBeTruthy();
  });
});
