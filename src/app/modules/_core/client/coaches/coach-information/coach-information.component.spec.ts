import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachInformationComponent } from './coach-information.component';

describe('CoachInformationComponent', () => {
  let component: CoachInformationComponent;
  let fixture: ComponentFixture<CoachInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CoachInformationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
