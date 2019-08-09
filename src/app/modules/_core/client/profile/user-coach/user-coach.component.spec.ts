import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCoachComponent } from './user-coach.component';

describe('UserCoachComponent', () => {
  let component: UserCoachComponent;
  let fixture: ComponentFixture<UserCoachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCoachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
