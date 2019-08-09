import { TestBed } from '@angular/core/testing';

import { ShareProductCategoryService } from './share-product-category.service';

describe('ShareProductCategoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareProductCategoryService = TestBed.get(ShareProductCategoryService);
    expect(service).toBeTruthy();
  });
});
