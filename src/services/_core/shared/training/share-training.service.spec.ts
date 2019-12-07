import {TestBed} from '@angular/core/testing';

import {ShareTrainingService} from './share-training.service';

describe('ShareTrainingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareTrainingService = TestBed.get(ShareTrainingService);
    expect(service).toBeTruthy();
  });
});
