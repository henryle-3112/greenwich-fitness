import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReplyOnProductFeedback } from '@gw-models/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ReplyOnProductFeedbackService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get replies on product's feedback
   */
  public getRepliesOnProductFeedback(url: string): Observable<ReplyOnProductFeedback[]> {
    return this.http.get<ReplyOnProductFeedback[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add reply on product's feedback
   * @param replyOnProductFeedback - reply on product's feedback that will be added
   */
  public addReplyOnProductFeedback(url: string, replyOnProductFeedback: ReplyOnProductFeedback): Observable<ReplyOnProductFeedback> {
    return this.http.post<ReplyOnProductFeedback>(url, replyOnProductFeedback, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to update reply on product's feedback
   * @param replyOnProductFeedback - reply on product's feedback that will be updated
   */
  public updateReplyOnProductFeedback(url: string, replyOnProductFeedback: ReplyOnProductFeedback): Observable<ReplyOnProductFeedback> {
    return this.http.put<ReplyOnProductFeedback>(url, replyOnProductFeedback, httpOptions);
  }
}
