import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BuyingHistoryDetailComponent} from './buying-history-detail.component';

describe('BuyingHistoryDetailComponent', () => {
  let component: BuyingHistoryDetailComponent;
  let fixture: ComponentFixture<BuyingHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuyingHistoryDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyingHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
