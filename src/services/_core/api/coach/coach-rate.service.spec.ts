import { TestBed } from '@angular/core/testing';

import { CoachRateService } from './coach-rate.service';

describe('CoachRateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoachRateService = TestBed.get(CoachRateService);
    expect(service).toBeTruthy();
  });
});
