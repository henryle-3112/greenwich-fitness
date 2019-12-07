import {TestBed} from '@angular/core/testing';

import {ProductSlideService} from './product-slide.service';

describe('ProductSlideService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductSlideService = TestBed.get(ProductSlideService);
    expect(service).toBeTruthy();
  });
});
