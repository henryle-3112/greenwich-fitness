import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {
  ReplyOnNewFeedCommentReaction
} from '@gw-models/core';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ReplyOnNewFeedCommentReactionService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get reactions of replies on coach's feedback
   */
  public getReplyOnNewFeedCommentReactions(url: string): Observable<ReplyOnNewFeedCommentReaction[]> {
    return this.http.get<ReplyOnNewFeedCommentReaction[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add reaction of reply on newfeed's comment
   * @param replyOnNewFeedCommentReaction - reaction of reply on newfeeds's comment that will be added
   */
  public addReplyOnNewFeedCommentReaction(url: string, replyOnNewFeedCommentReaction: ReplyOnNewFeedCommentReaction)
    : Observable<ReplyOnNewFeedCommentReaction> {
    return this.http.post<ReplyOnNewFeedCommentReaction>(url, replyOnNewFeedCommentReaction, httpOptions);
  }
}
