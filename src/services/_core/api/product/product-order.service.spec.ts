import { TestBed } from '@angular/core/testing';

import { ProductOrderService } from './product-order.service';

describe('ProductOrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductOrderService = TestBed.get(ProductOrderService);
    expect(service).toBeTruthy();
  });
});
