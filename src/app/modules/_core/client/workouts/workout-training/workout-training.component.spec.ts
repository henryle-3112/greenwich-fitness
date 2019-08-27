import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutTrainingComponent } from './workout-training.component';

describe('WorkoutTrainingComponent', () => {
  let component: WorkoutTrainingComponent;
  let fixture: ComponentFixture<WorkoutTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkoutTrainingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
