import {TestBed} from '@angular/core/testing';

import {ShareMessageService} from './share-message.service';

describe('ShareMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareMessageService = TestBed.get(ShareMessageService);
    expect(service).toBeTruthy();
  });
});
