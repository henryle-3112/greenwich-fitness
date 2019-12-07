import {TestBed} from '@angular/core/testing';

import {ShareMembershipScheduleService} from './share-membership-schedule.service';

describe('ShareMembershipScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareMembershipScheduleService = TestBed.get(ShareMembershipScheduleService);
    expect(service).toBeTruthy();
  });
});
