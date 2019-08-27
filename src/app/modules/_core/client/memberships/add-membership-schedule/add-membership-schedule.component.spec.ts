import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMembershipScheduleComponent } from './add-membership-schedule.component';

describe('AddMembershipScheduleComponent', () => {
  let component: AddMembershipScheduleComponent;
  let fixture: ComponentFixture<AddMembershipScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddMembershipScheduleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMembershipScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
