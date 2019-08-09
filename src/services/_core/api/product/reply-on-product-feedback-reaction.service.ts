import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ReplyOnProductFeedback, ReplyOnProductFeedbackReaction, ResponseMessage, UserProfile} from '@gw-models/core';
import {Observable} from 'rxjs';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ReplyOnProductFeedbackReactionService {

  constructor(private http: HttpClient) {
  }

  /** POST: count number of reply on product's feedback reaction */
  public countNumberOfReplyOnProductFeedbackReaction(
    replyOnProductFeedback: ReplyOnProductFeedback, reactionType: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountReplyOnProductFeedbackReaction}/${reactionType}`, replyOnProductFeedback, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** POST: get reply on product feedback reactions by user's profile */
  public getReplyOnProductFeedbackReactionsByUserProfile(userProfile: UserProfile): Observable<ReplyOnProductFeedbackReaction[]> {
    return this.http.post<ReplyOnProductFeedbackReaction[]>(
      `${Config.api}/${Config.apiGetReplyOnProductFeedbackReaction}`, userProfile, httpOptions).pipe(
      tap(
        (replyOnProductFeedbackReactions: ReplyOnProductFeedbackReaction[]) => console.log(JSON.stringify(replyOnProductFeedbackReactions)))
    );
  }

  /** POST: add new reply on product feedback reaction */
  public addNewReplyOnProductFeedbackReaction(
    replyOnProductFeedbackReaction: ReplyOnProductFeedbackReaction): Observable<ReplyOnProductFeedbackReaction> {
    return this.http.post<ReplyOnProductFeedbackReaction>(
      `${Config.api}/${Config.apiAddNewReplyOnProductFeedbackReaction}`, replyOnProductFeedbackReaction, httpOptions).pipe(
      tap(
        (insertedReplyOnProductFeedbackReaction: ReplyOnProductFeedbackReaction) =>
          console.log(JSON.stringify(insertedReplyOnProductFeedbackReaction)))
    );
  }
}
