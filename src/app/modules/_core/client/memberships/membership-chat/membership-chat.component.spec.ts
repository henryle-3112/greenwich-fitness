import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipChatComponent } from './membership-chat.component';

describe('MembershipChatComponent', () => {
  let component: MembershipChatComponent;
  let fixture: ComponentFixture<MembershipChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
