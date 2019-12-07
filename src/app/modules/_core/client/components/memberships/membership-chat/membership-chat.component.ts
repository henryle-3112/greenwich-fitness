import {NzModalService} from 'ng-zorro-antd';
import {ShareMembershipService, ShareUserProfileService} from '@gw-services/shared';
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Config} from '@gw-config';
import {ChatMessageService, CoachService, ParticipantService, SocketService} from '@gw-services/api';
import {ChatMessage, Coach, Membership, Participant, UserProfile} from '@gw-models';
import {Router} from '@angular/router';

declare var Peer: any;

@Component({
  selector: 'app-membership-chat',
  templateUrl: './membership-chat.component.html',
  styleUrls: ['./membership-chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MembershipChatComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoadingSpinnerShown: boolean;
  currentUserChatMessage: string;
  emojiIcon: any;
  selectedUserProfile: UserProfile;
  selectedCoach: Coach;
  selectedParticipant: Participant;
  selectedMembership: Membership;
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

  constructor(private socketService: SocketService,
              private chatMessageService: ChatMessageService,
              private shareUserProfileService: ShareUserProfileService,
              private shareMembershipService: ShareMembershipService,
              private participantService: ParticipantService,
              private coachService: CoachService,
              private modalService: NzModalService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.initData();
    this.connectToSocketServer();
    this.peerConnect();
  }

  /**
   * handle cancel video call modal
   */
  public handleCancelVideoCallModal(): void {
    this.socketService.stopVideoCall();
  }

  /**
   * send chat message
   */
  public sendChatMessage() {
    const chatMessage = {
      'sender': `${this.selectedUserProfile.id}`,
      'message': `${this.currentUserChatMessage}`
    };
    this.socketService.sendChatMessage(chatMessage);
    this.saveChatMessageToServer(chatMessage);
    console.log(`${this.currentUserChatMessage}`);
    this.currentUserChatMessage = '';
  }

  /**
   * add emoji to current chat message
   */
  public addEmojiToCurrentChatMessage() {
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
   * peer connect for video call
   */
  private peerConnect(): void {
    this.peer = new Peer({key: 'lwjd5qra8257b9'});
    this.onPeerOpened();
    this.onPeerCall();
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
      nzContent: `${this.selectedMembership.userProfile.fullName} is calling you`,
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
   *
   * @param stream - stream
   */
  private playRemoteStream(stream): void {
    this.remoteStreamNativeElement.srcObject = stream;
    this.remoteStreamNativeElement.play();
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
   *
   * get selected coach
   */
  private getSelectedCoach(): void {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = this.selectedUserProfile.id;
    const getCoachUrl = `${Config.apiBaseUrl}/
${Config.apiCoachManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiCoaches}`;
    this.coachService.getCoach(getCoachUrl)
      .subscribe((selectedCoach: Coach) => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          this.getSelectedMembership();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get selected membership
   */
  private getSelectedMembership(): void {
    this.isLoadingSpinnerShown = true;
    this.shareMembershipService.currentMembership
      .subscribe((selectedMembership: Membership) => {
        if (selectedMembership) {
          this.selectedMembership = selectedMembership;
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
  private getSelectedParticipant() {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = this.selectedMembership.userProfile.id;
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
  private joinChatRoomBetweenUserAndCoach() {
    const selectedChatRoom = `${this.selectedParticipant.chatRoom.id} - ${this.selectedParticipant.chatRoom.name}`;
    this.socketService.joinChatRoom(selectedChatRoom);
    this.socket = this.socketService.getSocket();
    this.listenChatMessagesFromServer();
    this.listenPeerIdsFromServer();
    this.listenStopVideoCallEvent();
  }

  /**
   * listen peer ids from server
   */
  private listenPeerIdsFromServer() {
    const that = this;
    this.socket.on('serverSendPeerToRoom', function (peerIdsArr: any) {
      console.log(peerIdsArr);
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

  /**
   * connect to socket server
   */
  private connectToSocketServer() {
    this.socketService.connect(Config.serverSocketUrl);
  }

}
