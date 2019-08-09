import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {
  ReplyOnCoachFeedback,
  ReplyOnCoachFeedbackReaction,
  ResponseMessage,
  UserProfile
} from '@gw-models/core';
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
export class ReplyOnCoachFeedbackReactionService {

  constructor(private http: HttpClient) {
  }

  /** POST: count number of reply on coach feedback reaction */
  public countNumberOfReplyOnCoachFeedbackReaction(
    replyOnCoachFeedback: ReplyOnCoachFeedback, reactionType: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountReplyOnCoachFeedbackReaction}/${reactionType}`, replyOnCoachFeedback, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** POST: get reply on coach feedback reactions by user's profile */
  public getReplyOnCoachFeedbackReactionsByUserProfile(userProfile: UserProfile): Observable<ReplyOnCoachFeedbackReaction[]> {
    return this.http.post<ReplyOnCoachFeedbackReaction[]>(
      `${Config.api}/${Config.apiGetReplyOnCoachFeedbackReaction}`, userProfile, httpOptions).pipe(
      tap(
        (replyOnCoachFeedbackReactions: ReplyOnCoachFeedbackReaction[]) => console.log(JSON.stringify(replyOnCoachFeedbackReactions)))
    );
  }

  /** POST: add new reply on coach feedback reaction */
  public addNewReplyOnCoachFeedbackReaction(
    replyOnCoachFeedbackReaction: ReplyOnCoachFeedbackReaction): Observable<ReplyOnCoachFeedbackReaction> {
    return this.http.post<ReplyOnCoachFeedbackReaction>(
      `${Config.api}/${Config.apiAddNewReplyOnCoachFeedbackReaction}`, replyOnCoachFeedbackReaction, httpOptions).pipe(
      tap(
        (insertedReplyOnCoachFeedbackReaction: ReplyOnCoachFeedbackReaction) =>
          console.log(JSON.stringify(insertedReplyOnCoachFeedbackReaction)))
    );
  }
}
