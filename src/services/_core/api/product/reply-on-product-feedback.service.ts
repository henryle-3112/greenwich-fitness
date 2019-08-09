import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductFeedback, ReplyOnProductFeedback, ResponseMessage} from '@gw-models/core';
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
export class ReplyOnProductFeedbackService {

  constructor(private http: HttpClient) {
  }

  /** POST: get number of product's feedback replies */
  public countNumberOfProductFeedbackReplies(productFeedback: ProductFeedback, status: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountNumberOfProductFeedbackReplies}/${status}`, productFeedback, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** POST: get replies on selected product's feedback */
  public getRepliesOnSelectedProductFeedback(productFeedback: ProductFeedback, status: number): Observable<ReplyOnProductFeedback[]> {
    return this.http.post<ReplyOnProductFeedback[]>(
      `${Config.api}/${Config.apiGetRepliesOnSelectedProductFeedback}/${status}`, productFeedback, httpOptions).pipe(
      tap((repliesOnProductFeedback: ReplyOnProductFeedback[]) => console.log(JSON.stringify(repliesOnProductFeedback)))
    );
  }

  /** POST: add new reply on product's feedback */
  public addReplyOnProductFeedback(replyOnProductFeedback: ReplyOnProductFeedback): Observable<ReplyOnProductFeedback> {
    return this.http.post<ReplyOnProductFeedback>(
      `${Config.api}/${Config.apiAddNewReplyOnProductFeedback}`, replyOnProductFeedback, httpOptions).pipe(
      tap((insertedReplyOnProductFeedback: ReplyOnProductFeedback) => console.log(JSON.stringify(insertedReplyOnProductFeedback)))
    );
  }
}
