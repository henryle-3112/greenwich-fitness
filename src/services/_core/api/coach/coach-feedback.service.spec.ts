import {TestBed} from '@angular/core/testing';

import {CoachFeedbackService} from './coach-feedback.service';

describe('CoachFeedbackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoachFeedbackService = TestBed.get(CoachFeedbackService);
    expect(service).toBeTruthy();
  });
});
