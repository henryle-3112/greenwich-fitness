import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachMembershipComponent } from './coach-membership.component';

describe('CoachMembershipComponent', () => {
  let component: CoachMembershipComponent;
  let fixture: ComponentFixture<CoachMembershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachMembershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
