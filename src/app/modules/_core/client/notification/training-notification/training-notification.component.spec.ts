import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingNotificationComponent } from './training-notification.component';

describe('TrainingNotificationComponent', () => {
  let component: TrainingNotificationComponent;
  let fixture: ComponentFixture<TrainingNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
