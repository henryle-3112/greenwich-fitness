import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { Config } from '@gw-config/core';
import { ChatBotMessage } from '@gw-models/core';

const httpOptionsForWit = {
  headers: new HttpHeaders({ 'Authorization': `${Config.witClientToken}` })
};

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  private httpClient: HttpClient;

  constructor(handler: HttpBackend,
  private http: HttpClient) {
    this.httpClient = new HttpClient(handler);
  }

  /**
   *
   * @param url - url that will be used to get messages from chat bot
   */
  public getMessagesFromChatBot(url: string) {
    return this.httpClient.get<any>(url, httpOptionsForWit);
  }

  /**
   *
   * @param url - url that will be used to add chat's bot's message
   * @param chatBotMessage - inserted chat's bot's message
   */
  public addChatBotMessage(url: string, chatBotMessage: ChatBotMessage) {
    return this.http.post<ChatBotMessage>(url, chatBotMessage, httpOptions);
  }
}
