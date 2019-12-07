import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ChatMessage} from '@gw-models';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to add chat's message
   * @param chatMessage - chat's message that will be added
   */
  public addChatMessage(url: string, chatMessage: ChatMessage) {
    return this.http.post<ChatMessage>(url, chatMessage, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to get chat's messages
   */
  public getChatMessages(url: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(url, httpOptions);
  }
}
