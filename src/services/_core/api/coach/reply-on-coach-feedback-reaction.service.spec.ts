import { TestBed } from '@angular/core/testing';

import { ReplyOnCoachFeedbackReactionService } from './reply-on-coach-feedback-reaction.service';

describe('ReplyOnCoachFeedbackReactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReplyOnCoachFeedbackReactionService = TestBed.get(ReplyOnCoachFeedbackReactionService);
    expect(service).toBeTruthy();
  });
});
