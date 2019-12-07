import {TestBed} from '@angular/core/testing';

import {CoachMembershipNotificationService} from './coach-membership-notification.service';

describe('CoachMembershipNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoachMembershipNotificationService = TestBed.get(CoachMembershipNotificationService);
    expect(service).toBeTruthy();
  });
});
