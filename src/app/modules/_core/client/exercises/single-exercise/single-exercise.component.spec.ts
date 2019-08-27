import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleExerciseComponent } from './single-exercise.component';

describe('SingleExerciseComponent', () => {
  let component: SingleExerciseComponent;
  let fixture: ComponentFixture<SingleExerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SingleExerciseComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
