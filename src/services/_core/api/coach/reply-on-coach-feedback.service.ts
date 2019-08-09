import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CoachFeedback, ReplyOnCoachFeedback, ResponseMessage} from '@gw-models/core';
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
export class ReplyOnCoachFeedbackService {

  constructor(private http: HttpClient) {
  }

  /** POST: get number of coach feedback replies */
  public countNumberOfCoachFeedbackReplies(coachFeedback: CoachFeedback, status: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountNumberOfCoachFeedbackReplies}/${status}`, coachFeedback, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** POST: get replies on selected coach feedback */
  public getRepliesOnSelectedCoachFeedback(coachFeedback: CoachFeedback, status: number): Observable<ReplyOnCoachFeedback[]> {
    return this.http.post<ReplyOnCoachFeedback[]>(
      `${Config.api}/${Config.apiGetRepliesOnSelectedCoachFeedback}/${status}`, coachFeedback, httpOptions).pipe(
      tap((repliesOnCoachFeedback: ReplyOnCoachFeedback[]) => console.log(JSON.stringify(repliesOnCoachFeedback)))
    );
  }

  /** POST: add new reply on coach's feedback */
  public addReplyOnCoachFeedback(replyOnCoachFeedback: ReplyOnCoachFeedback): Observable<ReplyOnCoachFeedback> {
    return this.http.post<ReplyOnCoachFeedback>(
      `${Config.api}/${Config.apiAddNewReplyOnCoachFeedback}`, replyOnCoachFeedback, httpOptions).pipe(
      tap((insertedReplyOnCoachFeedback: ReplyOnCoachFeedback) => console.log(JSON.stringify(insertedReplyOnCoachFeedback)))
    );
  }
}
