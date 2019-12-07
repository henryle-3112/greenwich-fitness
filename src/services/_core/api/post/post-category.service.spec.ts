import {TestBed} from '@angular/core/testing';

import {PostCategoryService} from './post-category.service';

describe('PostCategoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostCategoryService = TestBed.get(PostCategoryService);
    expect(service).toBeTruthy();
  });
});
