import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinterestShareComponent } from './pinterest-share.component';

describe('PinterestShareComponent', () => {
  let component: PinterestShareComponent;
  let fixture: ComponentFixture<PinterestShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PinterestShareComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinterestShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
