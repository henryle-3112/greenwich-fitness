import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';
import {PostComment, ReplyOnPostComment, ResponseMessage} from '@gw-models/core';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class ReplyOnPostCommentService {

  constructor(private http: HttpClient) {
  }

  /** POST: get number of post's comment replies */
  public countNumberOfPostCommentReplies(postComment: PostComment, status: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountNumberOfPostCommentReplies}/${status}`, postComment, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** POST: get replies on selected post's comment */
  public getRepliesOnSelectedPostComment(postComment: PostComment, status: number): Observable<ReplyOnPostComment[]> {
    return this.http.post<ReplyOnPostComment[]>(
      `${Config.api}/${Config.apiGetRepliesOnSelectedPostComment}/${status}`, postComment, httpOptions).pipe(
      tap((repliesOnPostComment: ReplyOnPostComment[]) => console.log(JSON.stringify(repliesOnPostComment)))
    );
  }

  /** POST: add new reply on post's comment */
  public addReplyOnPostComment(replyOnPostComment: ReplyOnPostComment): Observable<ReplyOnPostComment> {
    return this.http.post<ReplyOnPostComment>(
      `${Config.api}/${Config.apiAddNewReplyOnPostComment}`, replyOnPostComment, httpOptions).pipe(
      tap((insertedReplyOnPostComment: ReplyOnPostComment) => console.log(JSON.stringify(insertedReplyOnPostComment)))
    );
  }
}
