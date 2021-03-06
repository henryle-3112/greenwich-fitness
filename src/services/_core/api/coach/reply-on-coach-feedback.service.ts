import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ReplyOnCoachFeedback} from '@gw-models';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ReplyOnCoachFeedbackService {

  constructor(private http: HttpClient) {
  }


  /**
   *
   * @param url - url that will be used to get replies on coach's feedback
   */
  public getRepliesOnCoachFeedback(url: string): Observable<ReplyOnCoachFeedback[]> {
    return this.http.get<ReplyOnCoachFeedback[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add reply on coach's feedback
   * @param replyOnCoachFeedback - reply on coach's feedback that will be added
   */
  public addReplyOnCoachFeedback(url: string, replyOnCoachFeedback: ReplyOnCoachFeedback): Observable<ReplyOnCoachFeedback> {
    return this.http.post<ReplyOnCoachFeedback>(url, replyOnCoachFeedback, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to update reply on coach's feedback
   * @param replyOnCoachFeedback - reply on coach's feedback that will be updated
   */
  public updateReplyOnCoachFeedback(url: string, replyOnCoachFeedback: ReplyOnCoachFeedback): Observable<ReplyOnCoachFeedback> {
    return this.http.put<ReplyOnCoachFeedback>(url, replyOnCoachFeedback, httpOptions);
  }
}
