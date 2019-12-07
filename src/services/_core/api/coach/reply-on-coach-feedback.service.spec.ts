import {TestBed} from '@angular/core/testing';

import {ReplyOnCoachFeedbackService} from './reply-on-coach-feedback.service';

describe('ReplyOnCoachFeedbackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReplyOnCoachFeedbackService = TestBed.get(ReplyOnCoachFeedbackService);
    expect(service).toBeTruthy();
  });
});
