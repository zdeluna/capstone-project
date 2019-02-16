import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageBoardReplyComponent } from './message-board-reply.component';

describe('MessageBoardReplyComponent', () => {
  let component: MessageBoardReplyComponent;
  let fixture: ComponentFixture<MessageBoardReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageBoardReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageBoardReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
