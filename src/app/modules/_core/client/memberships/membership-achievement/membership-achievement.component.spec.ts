import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipAchievementComponent } from './membership-achievement.component';

describe('MembershipAchievementComponent', () => {
  let component: MembershipAchievementComponent;
  let fixture: ComponentFixture<MembershipAchievementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MembershipAchievementComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
