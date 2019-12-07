import {TestBed} from '@angular/core/testing';

import {ShareProductOrderService} from './share-product-order.service';

describe('ShareProductOrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareProductOrderService = TestBed.get(ShareProductOrderService);
    expect(service).toBeTruthy();
  });
});
