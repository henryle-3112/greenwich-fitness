import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedCoachesComponent } from './recommended-coaches.component';

describe('RecommendedCoachesComponent', () => {
  let component: RecommendedCoachesComponent;
  let fixture: ComponentFixture<RecommendedCoachesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendedCoachesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedCoachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
