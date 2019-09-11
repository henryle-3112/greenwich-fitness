import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: any;

  constructor() { }

  /**
   *
   * @param serverUrl - server socket that will be connected
   */
  connect(serverUrl: string): void {
    this.socket = io(serverUrl);
  }

  /**
   *
   * @param chatRoom - chat's room that will be created
   */
  joinChatRoom(chatRoom: string): void {
    this.socket.emit('createRoom', chatRoom);
  }

  /**
   *
   * @param chatMessage - send chat's message
   */
  sendChatMessage(chatMessage: any): void {
    this.socket.emit('sendMessageToRoom', chatMessage);
  }

  /**
   *
   * @param peerId - peer's id that will be sent to socket server
   */
  sendPeerId(peerId: string): void {
    this.socket.emit('sendPeerIdToRoom', peerId);
  }

  /**
   * stop video call
   */
  stopVideoCall(): void {
    this.socket.emit('stopVideoCall');
  }

  /**
   * return socket
   */
  getSocket(): any {
    return this.socket;
  }

  /**
   * disconnect to socket server
   */
  disconnect(): void {
    this.socket.emit('disconnectServer');
  }
}
