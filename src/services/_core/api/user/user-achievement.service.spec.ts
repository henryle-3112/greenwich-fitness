import { TestBed } from '@angular/core/testing';

import { UserAchievementService } from './user-achievement.service';

describe('UserAchievementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserAchievementService = TestBed.get(UserAchievementService);
    expect(service).toBeTruthy();
  });
});
