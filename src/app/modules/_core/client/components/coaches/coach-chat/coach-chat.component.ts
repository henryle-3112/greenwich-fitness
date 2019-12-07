import {NzModalService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Config} from '@gw-config';
import {ShareCoachService, ShareUserProfileService} from '@gw-services/shared';
import {ChatMessageService, ParticipantService, SocketService} from '@gw-services/api';
import {ChatMessage, Coach, Participant, UserProfile} from '@gw-models';

declare var Peer: any;

@Component({
  selector: 'app-coach-chat',
  templateUrl: './coach-chat.component.html',
  styleUrls: ['./coach-chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CoachChatComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoadingSpinnerShown: boolean;
  currentUserChatMessage: string;
  emojiIcon: any;
  selectedUserProfile: UserProfile;
  selectedCoach: Coach;
  selectedParticipant: Participant;
  socket: any;
  currentChatContent: string;
  @ViewChild('remoteStream') remoteStreamElementRef: ElementRef;
  @ViewChild('videoCallModal') videoCallModalElementRef: ElementRef;
  @ViewChild('videoCallModalContent') videoCallModalContentElementRef: ElementRef;
  remoteStreamNativeElement: any;
  videoCallModalNativeElement: any;
  videoCallModalContentNativeElement: any;
  peer: any;
  peerId: string;
  remoteId: string;
  isSomeoneCalling: boolean;
  callObj: any;
  peerIdsArr: any;
  isLoadingRemoteStream: boolean;
  localStream: any;


  /**
   *
   * @param socketService - inject socketService
   * @param chatMessageService - inject chatMessageService
   * @param shareUserProfileService - inject shareUserProfileService
   * @param shareCoachService - inject shareCoachService
   * @param participantService - inject participantService
   * @param modalService - inject modalService
   * @param router - inject router
   */
  constructor(private socketService: SocketService,
              private chatMessageService: ChatMessageService,
              private shareUserProfileService: ShareUserProfileService,
              private shareCoachService: ShareCoachService,
              private participantService: ParticipantService,
              private modalService: NzModalService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.initData();
    this.connectToSocketServer();
    this.peerConnect();
    this.onPeerCall();
  }

  /**
   * make video call
   */
  public makeVideoCall(): void {
    this.isLoadingRemoteStream = true;
    this.openStream()
      .then(stream => {
        this.videoCallModalNativeElement.style.display = 'block';
        this.videoCallModalContentNativeElement.style.background = '#fefefe';
        this.localStream = stream;
        const call = this.peer.call(this.remoteId, stream);
        call.on('stream', remoteStream => {
          this.playRemoteStream(remoteStream);
          this.isLoadingRemoteStream = false;
          this.videoCallModalContentNativeElement.style.background = 'transparent';
        });
      });
  }

  /**
   * handle cancele video call modal
   */
  public handleCancelVideoCallModal(): void {
    this.socketService.stopVideoCall();
  }

  /**
   * send chat message
   */
  public sendChatMessage(): void {
    const chatMessage = {
      'sender': `${this.selectedUserProfile.id}`,
      'message': `${this.currentUserChatMessage}`
    };
    this.socketService.sendChatMessage(chatMessage);
    this.saveChatMessageToServer(chatMessage);
    this.currentUserChatMessage = '';
  }

  /**
   * add emoji to current chat message
   */
  public addEmojiToCurrentChatMessage(): void {
    this.currentUserChatMessage += this.emojiIcon;
  }

  ngOnDestroy(): void {
    this.socketService.stopVideoCall();
    this.socketService.disconnect();
  }

  ngAfterViewInit(): void {
    this.remoteStreamNativeElement = this.remoteStreamElementRef.nativeElement;
    this.videoCallModalNativeElement = this.videoCallModalElementRef.nativeElement;
    this.videoCallModalContentNativeElement = this.videoCallModalContentElementRef.nativeElement;
  }

  /**
   * on peer call
   */
  private onPeerCall() {
    const that = this;
    this.peer.on('call', call => {
      that.callObj = call;
      that.showConfirmVideoCallModal();
    });
  }

  /**
   * show confirm video call modal
   */
  private showConfirmVideoCallModal(): void {
    const that = this;
    this.modalService.confirm({
      nzTitle: 'Video Call',
      nzContent: `${this.selectedCoach.userProfile.fullName} is calling you`,
      nzOnOk: () => {
        this.isLoadingRemoteStream = true;
        this.openStream()
          .then(stream => {
            that.videoCallModalNativeElement.style.display = 'block';
            that.videoCallModalContentNativeElement.style.background = '#fefefe';
            that.localStream = stream;
            that.callObj.answer(stream);
            that.callObj.on('stream', remoteStream => {
              that.isLoadingRemoteStream = false;
              that.playRemoteStream(remoteStream);
              that.videoCallModalContentNativeElement.style.background = 'transparent';
            });
          });
      },
      nzOnCancel: () => {
        this.socketService.stopVideoCall();
      }
    });
  }

  /**
   * peer connect for video call
   */
  private peerConnect(): void {
    this.peer = new Peer({key: 'lwjd5qra8257b9'});
    this.onPeerOpened();
  }

  /**
   * on peer opended
   */
  private onPeerOpened() {
    this.peer.on('open', id => {
      console.log(id);
      this.peerId = id;
      this.socketService.sendPeerId(this.peerId);
    });
  }

  /**
   * open stream
   */
  private openStream(): any {
    const config = {audio: false, video: true};
    return navigator.mediaDevices.getUserMedia(config);
  }

  /**
   *
   * @param stream - stream
   */
  private playRemoteStream(stream): void {
    this.remoteStreamNativeElement.srcObject = stream;
    this.remoteStreamNativeElement.play();
  }

  /**
   * init data
   */
  private initData(): void {
    this.peerIdsArr = [];
    this.emojiIcon = String.fromCodePoint(0x1F354);
    this.currentUserChatMessage = '';
    this.currentChatContent = '';
    this.getSelectedUserProfile();
  }

  /**
   * connect to socket server
   */
  private connectToSocketServer(): void {
    this.socketService.connect(Config.serverSocketUrl);
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile(): void {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe((selectedUserProfile: UserProfile) => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.getSelectedCoach();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get selected coach
   */
  private getSelectedCoach(): void {
    this.isLoadingSpinnerShown = true;
    this.shareCoachService.currentCoach
      .subscribe((selectedCoach: Coach) => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          this.getSelectedParticipant();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get selected participant
   */
  private getSelectedParticipant(): void {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = this.selectedUserProfile.id;
    const selectedCoachId = this.selectedCoach.id;
    const getParticipantUrl = `${Config.apiBaseUrl}/
${Config.apiChatManagementPrefix}/
${Config.apiParticipants}?
${Config.userProfileIdParameter}=${selectedUserProfileId}&
${Config.coachIdParameter}=${selectedCoachId}`;
    this.participantService.getParticipant(getParticipantUrl)
      .subscribe((selectedParticipant: Participant) => {
        if (selectedParticipant) {
          this.selectedParticipant = selectedParticipant;
          this.getChatMessages();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get chat messages
   */
  private getChatMessages() {
    const selectedChatRoomId = this.selectedParticipant.chatRoom.id;
    const getChatMessagesUrl = `${Config.apiBaseUrl}/
${Config.apiChatManagementPrefix}/
${Config.apiChatMessages}?
${Config.chatRoomIdParameter}=${selectedChatRoomId}`;
    this.isLoadingSpinnerShown = true;
    this.chatMessageService.getChatMessages(getChatMessagesUrl)
      .subscribe((chatMessages: ChatMessage[]) => {
        if (chatMessages && chatMessages.length) {
          this.showChatMessages(chatMessages);
        }
        this.joinChatRoomBetweenUserAndCoach();
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param chatMessages - chat's messages that will be shown
   */
  private showChatMessages(chatMessages: ChatMessage[]) {
    chatMessages.map((eachChatMessage: ChatMessage) => {
      if (eachChatMessage.userProfile.id === this.selectedUserProfile.id) {
        this.currentChatContent = this.currentChatContent +
          `<div class="message-right-container"><div class="message-right">${eachChatMessage.message}</div></div>`;
      } else {
        this.currentChatContent = this.currentChatContent +
          `<div class="message-left-container"><div class="message-left">${eachChatMessage.message}</div></div>`;
      }
    });
  }

  /**
   * join chat room between user and coach
   */
  private joinChatRoomBetweenUserAndCoach(): void {
    const selectedChatRoom = `${this.selectedParticipant.chatRoom.id} - ${this.selectedParticipant.chatRoom.name}`;
    this.socketService.joinChatRoom(selectedChatRoom);
    this.socket = this.socketService.getSocket();
    this.listenChatMessagesFromServer();
    this.listenPeerIdsFromServer();
    this.listenStopVideoCallEvent();
  }

  /**
   * listen stop video call event
   */
  private listenStopVideoCallEvent(): void {
    const that = this;
    this.socket.on('serverStopVideoCall', function () {
      that.videoCallModalNativeElement.style.display = 'none';
      that.isLoadingRemoteStream = false;
      that.remoteStreamNativeElement.pause();
      if (that.localStream) {
        that.localStream.getTracks()[0].stop();
      }
      that.localStream = '';
      that.remoteStreamNativeElement.src = that.localStream;
    });
  }

  /**
   * listen peer ids from server
   */
  private listenPeerIdsFromServer() {
    const that = this;
    this.socket.on('serverSendPeerToRoom', function (peerIdsArr: any) {
      that.peerIdsArr = peerIdsArr;
      that.peerIdsArr.map(eachPeerId => {
        if (eachPeerId !== that.peerId) {
          that.remoteId = eachPeerId;
          console.log(that.remoteId);
        }
      });
    });
  }

  /**
   * listen chat messages from server (from other users)
   */
  private listenChatMessagesFromServer(): void {
    const that = this;
    this.socket.on('serverSendMessageToRoom', function (chatMessage: any) {
      // if current message is from current user so the message will be go to the left and vice versa
      if (+chatMessage.sender === that.selectedUserProfile.id) {
        that.currentChatContent = that.currentChatContent +
          `<div class="message-right-container"><div class="message-right">${chatMessage.message}</div></div>`;
      } else {
        that.currentChatContent = that.currentChatContent +
          `<div class="message-left-container"><div class="message-left">${chatMessage.message}</div></div>`;
      }
    });
  }

  /**
   *
   * @param chatMessage - chat's message that will be saved to the database
   */
  private saveChatMessageToServer(chatMessage: any) {
    const chatMessageObj = new ChatMessage();
    chatMessageObj.chatRoom = this.selectedParticipant.chatRoom;
    chatMessageObj.message = chatMessage.message;
    chatMessageObj.userProfile = this.selectedUserProfile;
    const addChatMessageUrl = `${Config.apiBaseUrl}/${Config.apiChatManagementPrefix}/${Config.apiChatMessages}`;
    this.chatMessageService.addChatMessage(addChatMessageUrl, chatMessageObj)
      .subscribe();
  }
}
