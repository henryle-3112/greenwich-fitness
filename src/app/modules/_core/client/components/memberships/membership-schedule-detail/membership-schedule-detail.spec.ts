import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MembershipScheduleDetailComponent} from './membership-schedule-detail.component';

describe('MembershipScheduleDetailComponent', () => {
  let component: MembershipScheduleDetailComponent;
  let fixture: ComponentFixture<MembershipScheduleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MembershipScheduleDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipScheduleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
