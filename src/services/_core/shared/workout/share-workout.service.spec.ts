import { TestBed } from '@angular/core/testing';

import { ShareWorkoutService } from './share-workout.service';

describe('ShareWorkoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareWorkoutService = TestBed.get(ShareWorkoutService);
    expect(service).toBeTruthy();
  });
});
