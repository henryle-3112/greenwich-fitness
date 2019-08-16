import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ReplyOnNewFeedComment} from '@gw-models/core';
import {Observable} from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ReplyOnNewFeedCommentService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get replies on newfeed's comment
   */
  public getRepliesOnNewFeedComment(url: string): Observable<ReplyOnNewFeedComment[]> {
    return this.http.get<ReplyOnNewFeedComment[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add reply on newfeed's comment
   * @param replyOnNewFeedComment - reply on newfeed's comment that will be added
   */
  public addReplyOnNewFeedComment(url: string, replyOnNewFeedComment: ReplyOnNewFeedComment): Observable<ReplyOnNewFeedComment> {
    return this.http.post<ReplyOnNewFeedComment>(url, replyOnNewFeedComment, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to update reply on newfeed's comment
   * @param replyOnNewFeedComment - reply on newfeed's comment that will be updated
   */
  public updateReplyOnNewFeedComment(url: string, replyOnNewFeedComment: ReplyOnNewFeedComment): Observable<ReplyOnNewFeedComment> {
    return this.http.put<ReplyOnNewFeedComment>(url, replyOnNewFeedComment, httpOptions);
  }
}
