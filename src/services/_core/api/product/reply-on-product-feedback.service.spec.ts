import { TestBed } from '@angular/core/testing';

import { ReplyOnProductFeedbackService } from './reply-on-product-feedback.service';

describe('ReplyOnProductFeedbackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReplyOnProductFeedbackService = TestBed.get(ReplyOnProductFeedbackService);
    expect(service).toBeTruthy();
  });
});
