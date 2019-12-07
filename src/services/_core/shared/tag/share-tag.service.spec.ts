import {TestBed} from '@angular/core/testing';

import {ShareTagService} from './share-tag.service';

describe('ShareTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareTagService = TestBed.get(ShareTagService);
    expect(service).toBeTruthy();
  });
});
