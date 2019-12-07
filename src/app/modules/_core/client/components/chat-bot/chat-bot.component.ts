import {Router} from '@angular/router';
import {ShareUserProfileService} from '@gw-services/shared';
import {NzNotificationService} from 'ng-zorro-antd';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ChatBotService} from '@gw-services/api';
import {Config} from '@gw-config';
import {ChatBotMessage, UserProfile} from '@gw-models';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatBotComponent implements OnInit {
  isLoadingSpinnerShown: boolean;
  currentUserChatMessage: string;
  currentChatContent: string;
  selectedUserProfile: UserProfile;

  /**
   *
   * @param chatBotService - inject chatBotService
   * @param notification - inject notification
   * @param shareUserProfileService - inject shareUserProfileService
   * @param router - inject router
   */
  constructor(private chatBotService: ChatBotService,
              private notification: NzNotificationService,
              private shareUserProfileService: ShareUserProfileService,
              private router: Router) {
  }

  ngOnInit() {
    this.initData();
    this.getSelectedUserProfile();
  }

  /**
   * send chat message
   */
  public sendChatMessage(): void {
    const getMessagesFromChatBotUrl = `${Config.witUrl}${this.currentUserChatMessage}`;
    this.currentChatContent = this.currentChatContent +
      `<div class="message-right-container"><div class="message-right">${this.currentUserChatMessage}</div></div>`;
    this.chatBotService.getMessagesFromChatBot(getMessagesFromChatBotUrl)
      .subscribe((chatBotMessages: any) => {
        if (chatBotMessages) {
          this.showChatBotMessages(chatBotMessages);
        } else {
          this.createNotification('error', 'Error', 'Failure to handle your request! Please try again!');
        }
      });
    this.saveUserChatBotMessage(this.currentUserChatMessage);
    this.currentUserChatMessage = '';
  }

  /**
   *
   * @param type - type of notification
   * @param title - title of notification
   * @param content - content of notification
   */
  createNotification(type: string, title: string, content: string): void {
    this.notification.create(
      type,
      title,
      content
    );
  }

  /**
   * init data
   */
  private initData(): void {
    this.currentUserChatMessage = '';
    this.currentChatContent = '';
  }

  /**
   * get selected user profile
   */
  private getSelectedUserProfile() {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe((selectedUserProfile: UserProfile) => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * save user chat bot message
   */
  private saveUserChatBotMessage(userChatMessage: string): void {
    const addChatBotMessageUrl = `${Config.apiBaseUrl}/${Config.apiChatBotManagementPrefix}/${Config.apiChatBotMessages}`;
    const chatBotMessage = new ChatBotMessage();
    chatBotMessage.userProfile = this.selectedUserProfile;
    chatBotMessage.message = userChatMessage;
    this.chatBotService.addChatBotMessage(addChatBotMessageUrl, chatBotMessage)
      .subscribe();
  }

  /**
   *
   * @param chatBotMessages - chat bot's messages that will be shown to user
   */
  private showChatBotMessages(chatBotMessages): void {
    // intent that contains keywords
    const intents = chatBotMessages.entities.intent;
    intents.map(eachIntent => {
      this.handleWitIntent(eachIntent);
    });
  }

  /**
   *
   * @param eachIntent - each intent will be handled to show convenience message to user
   */
  private handleWitIntent(eachIntent: any): void {
    if (eachIntent.confidence > 0.5 && eachIntent.value === 'full_body') {
      const chatBotMessage = `You should get exercises from full body tag on the workouts list`;
      this.currentChatContent = this.currentChatContent +
        `<div class="message-left-container"><div class="message-left">${chatBotMessage}</div></div>`;
    }
  }

}
