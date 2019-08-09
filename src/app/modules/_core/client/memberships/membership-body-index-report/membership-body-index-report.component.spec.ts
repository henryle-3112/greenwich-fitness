import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipBodyIndexReportComponent } from './membership-body-index-report.component';

describe('MembershipBodyIndexReportComponent', () => {
  let component: MembershipBodyIndexReportComponent;
  let fixture: ComponentFixture<MembershipBodyIndexReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipBodyIndexReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipBodyIndexReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
