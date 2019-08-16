import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ReplyOnPostComment} from '@gw-models/core';

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

  /**
   *
   * @param url - url that will be used to get replies on post's comment
   */
  public getRepliesOnPostComment(url: string): Observable<ReplyOnPostComment[]> {
    return this.http.get<ReplyOnPostComment[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be added
   * @param replyOnPostComment - reply on post's comment that will be added
   */
  public addReplyOnPostComment(url: string, replyOnPostComment: ReplyOnPostComment): Observable<ReplyOnPostComment> {
    return this.http.post<ReplyOnPostComment>(url, replyOnPostComment, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to update reply on post's comment
   * @param replyOnPostComment - reply on post's comment that will be updated
   */
  public updateReplyOnPostComment(url: string, replyOnPostComment: ReplyOnPostComment): Observable<ReplyOnPostComment> {
    return this.http.put<ReplyOnPostComment>(url, replyOnPostComment, httpOptions);
  }
}
