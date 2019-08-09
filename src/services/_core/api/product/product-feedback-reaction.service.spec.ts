import { TestBed } from '@angular/core/testing';

import { ProductFeedbackReactionService } from './product-feedback-reaction.service';

describe('ProductFeedbackReactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductFeedbackReactionService = TestBed.get(ProductFeedbackReactionService);
    expect(service).toBeTruthy();
  });
});
