import { TestBed } from '@angular/core/testing';

import { ProductFeedbackService } from './product-feedback.service';

describe('ProductFeedbackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductFeedbackService = TestBed.get(ProductFeedbackService);
    expect(service).toBeTruthy();
  });
});
