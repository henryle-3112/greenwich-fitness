import {TestBed} from '@angular/core/testing';

import {CoachPaymentService} from './coach-payment.service';

describe('CoachPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoachPaymentService = TestBed.get(CoachPaymentService);
    expect(service).toBeTruthy();
  });
});
