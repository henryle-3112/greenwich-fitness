import { TestBed } from '@angular/core/testing';

import { SharePostCategoryService } from './share-post-category.service';

describe('SharePostCategoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharePostCategoryService = TestBed.get(SharePostCategoryService);
    expect(service).toBeTruthy();
  });
});
