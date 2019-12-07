import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CoachAchievementComponent} from './coach-achievement.component';

describe('CoachAchievementComponent', () => {
  let component: CoachAchievementComponent;
  let fixture: ComponentFixture<CoachAchievementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CoachAchievementComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
