import {TestBed} from '@angular/core/testing';

import {ProductOrderDetailService} from './product-order-detail.service';

describe('ProductOrderDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductOrderDetailService = TestBed.get(ProductOrderDetailService);
    expect(service).toBeTruthy();
  });
});
