import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MembershipScheduleComponent} from './membership-schedule.component';

describe('MembershipScheduleComponent', () => {
  let component: MembershipScheduleComponent;
  let fixture: ComponentFixture<MembershipScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MembershipScheduleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
