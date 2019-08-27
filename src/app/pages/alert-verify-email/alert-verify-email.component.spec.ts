import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertVerifyEmailComponent } from './alert-verify-email.component';

describe('AlertVerifyEmailComponent', () => {
  let component: AlertVerifyEmailComponent;
  let fixture: ComponentFixture<AlertVerifyEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertVerifyEmailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertVerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
