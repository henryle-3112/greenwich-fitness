import { TestBed } from '@angular/core/testing';

import { ProductPaymentService } from './product-payment.service';

describe('ProductPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductPaymentService = TestBed.get(ProductPaymentService);
    expect(service).toBeTruthy();
  });
});
