import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyIndexReportComponent } from './body-index-report.component';

describe('BodyIndexReportComponent', () => {
  let component: BodyIndexReportComponent;
  let fixture: ComponentFixture<BodyIndexReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BodyIndexReportComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyIndexReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
