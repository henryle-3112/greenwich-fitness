import {TestBed} from '@angular/core/testing';

import {ShareProductService} from './share-product.service';

describe('ShareProductService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareProductService = TestBed.get(ShareProductService);
    expect(service).toBeTruthy();
  });
});
