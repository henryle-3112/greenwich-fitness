import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachScheduleDetailComponent } from './coach-schedule-detail.component';

describe('CoachScheduleDetailComponent', () => {
  let component: CoachScheduleDetailComponent;
  let fixture: ComponentFixture<CoachScheduleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachScheduleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachScheduleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
