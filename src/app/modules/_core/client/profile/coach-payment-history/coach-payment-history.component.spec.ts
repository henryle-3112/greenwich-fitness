import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachPaymentHistoryComponent } from './coach-payment-history.component';

describe('CoachPaymentHistoryComponent', () => {
  let component: CoachPaymentHistoryComponent;
  let fixture: ComponentFixture<CoachPaymentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachPaymentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachPaymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
