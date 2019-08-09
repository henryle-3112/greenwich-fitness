import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingHistoryComponent } from './buying-history.component';

describe('BuyingHistoryComponent', () => {
  let component: BuyingHistoryComponent;
  let fixture: ComponentFixture<BuyingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
