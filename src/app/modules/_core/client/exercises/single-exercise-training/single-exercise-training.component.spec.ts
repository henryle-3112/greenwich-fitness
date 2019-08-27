import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleExerciseTrainingComponent } from './single-exercise-training.component';

describe('SingleExerciseTrainingComponent', () => {
  let component: SingleExerciseTrainingComponent;
  let fixture: ComponentFixture<SingleExerciseTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SingleExerciseTrainingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleExerciseTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
