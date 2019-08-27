import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAlertComponent } from './payment-alert.component';

describe('PaymentAlertComponent', () => {
  let component: PaymentAlertComponent;
  let fixture: ComponentFixture<PaymentAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentAlertComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
