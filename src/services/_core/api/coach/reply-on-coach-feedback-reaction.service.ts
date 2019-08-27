import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ReplyOnCoachFeedbackReaction,
} from '@gw-models/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ReplyOnCoachFeedbackReactionService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get reactions of replies on coach's feedback
   */
  public getReplyOnCoachFeedbackReactions(url: string): Observable<ReplyOnCoachFeedbackReaction[]> {
    return this.http.get<ReplyOnCoachFeedbackReaction[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add reaction of reply on coach's feedback
   * @param replyOnCoachFeedbackReaction - reaction of reply on coach's feedback that will be added
   */
  public addNewReplyOnCoachFeedbackReaction(url: string, replyOnCoachFeedbackReaction: ReplyOnCoachFeedbackReaction)
    : Observable<ReplyOnCoachFeedbackReaction> {
    return this.http.post<ReplyOnCoachFeedbackReaction>(url, replyOnCoachFeedbackReaction, httpOptions);
  }
}
