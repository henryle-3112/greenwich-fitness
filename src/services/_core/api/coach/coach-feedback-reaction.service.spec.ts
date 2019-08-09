import { TestBed } from '@angular/core/testing';

import { CoachFeedbackReactionService } from './coach-feedback-reaction.service';

describe('CoachFeedbackReactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoachFeedbackReactionService = TestBed.get(CoachFeedbackReactionService);
    expect(service).toBeTruthy();
  });
});
