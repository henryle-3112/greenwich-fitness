import {TestBed} from '@angular/core/testing';

import {ProductRateService} from './product-rate.service';

describe('ProductRateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductRateService = TestBed.get(ProductRateService);
    expect(service).toBeTruthy();
  });
});
