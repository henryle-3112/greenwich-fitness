import { TestBed } from '@angular/core/testing';

import { ShareSingleExerciseService } from './share-single-exercise.service';

describe('ShareSingleExerciseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareSingleExerciseService = TestBed.get(ShareSingleExerciseService);
    expect(service).toBeTruthy();
  });
});
