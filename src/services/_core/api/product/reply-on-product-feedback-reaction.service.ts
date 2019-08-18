import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ReplyOnProductFeedbackReaction} from '@gw-models/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ReplyOnProductFeedbackReactionService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get reaction of replies on product's feedback
   */
  public getReplyOnProductFeedbackReactions(url: string): Observable<ReplyOnProductFeedbackReaction[]> {
    return this.http.get<ReplyOnProductFeedbackReaction[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add reaction of reply on product's feedback
   * @param replyOnProductFeedbackReaction - reaction of reply on product's feedback that will be added
   */
  public addReplyOnProductFeedbackReaction(url: string, replyOnProductFeedbackReaction: ReplyOnProductFeedbackReaction):
    Observable<ReplyOnProductFeedbackReaction> {
    return this.http.post<ReplyOnProductFeedbackReaction>(url, replyOnProductFeedbackReaction, httpOptions);
  }
}
