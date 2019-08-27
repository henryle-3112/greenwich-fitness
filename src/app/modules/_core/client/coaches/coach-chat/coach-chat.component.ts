import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-coach-chat',
  templateUrl: './coach-chat.component.html',
  styleUrls: ['./coach-chat.component.css']
})
export class CoachChatComponent implements OnInit {
  isLoadingSpinnerShown: boolean;
  currentUserChatMessage: string;
  emojiIcon: any;

  constructor() {
  }

  ngOnInit() {
    this.initData();
  }

  /**
   * init data
   */
  private initData() {
    this.emojiIcon = String.fromCodePoint(0x1F354);
    this.currentUserChatMessage = '';
  }

  /**
   * send chat message
   */
  public sendChatMessage() {
    console.log(this.currentUserChatMessage);
    this.currentUserChatMessage = '';
  }

  /**
   * add emoji to current chat message
   */
  public addEmojiToCurrentChatMessage() {
    this.currentUserChatMessage += this.emojiIcon;
  }

}
