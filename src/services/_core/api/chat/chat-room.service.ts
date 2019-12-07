import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ChatRoom} from '@gw-models';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to add chat's room
   * @param chatRoom - chat's room that will be added to the database
   */
  public addChatRoom(url: string, chatRoom: ChatRoom) {
    return this.http.post<ChatRoom>(url, chatRoom, httpOptions);
  }
}
