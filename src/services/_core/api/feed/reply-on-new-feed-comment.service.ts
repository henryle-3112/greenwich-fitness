import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NewFeedComment, ReplyOnNewFeedComment, ResponseMessage} from '@gw-models/core';
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
export class ReplyOnNewFeedCommentService {

  constructor(private http: HttpClient) {
  }

  /** POST: get replies on new feed comment by new feed comment and status */
  public getRepliesOnNewFeedCommentByNewFeedCommentAndStatus(
    newFeedComment: NewFeedComment, status: number): Observable<ReplyOnNewFeedComment[]> {
    return this.http.post<ReplyOnNewFeedComment[]>(
      `${Config.api}/${Config.apiGetRepliesOnNewFeedCommentByNewFeedCommentAndStatus}/${status}`, newFeedComment, httpOptions).pipe(
      tap((repliesOnNewFeedComment: ReplyOnNewFeedComment[]) => console.log(JSON.stringify(repliesOnNewFeedComment)))
    );
  }

  /** POST: add new reply on new feed comment */
  public addReplyOnNewFeedComment(
    replyOnNewFeedComment: ReplyOnNewFeedComment): Observable<ReplyOnNewFeedComment> {
    return this.http.post<ReplyOnNewFeedComment>(
      `${Config.api}/${Config.apiCreateReplyOnNewFeedComment}`, replyOnNewFeedComment, httpOptions).pipe(
      tap((insertedReplyOnNewFeedComment: ReplyOnNewFeedComment) => console.log(JSON.stringify(insertedReplyOnNewFeedComment)))
    );
  }

  /** POST: count number of replies on new feed comment by new feed comment and status */
  public countNumberOfRepliesOnNewFeedCommentByNewFeedCommentAndStatus(
    newFeedComment: NewFeedComment, status: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountNumberOfRepliesOnNewFeedCommentByNewFeedCommentAndStatus}/${status}`,
      newFeedComment, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }
}
