import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReplyOnPostCommentReaction } from '@gw-models/core';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ReplyOnPostCommentReactionService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get reaction of replies on post's comment
   */
  public getReplyOnPostCommentReactions(url: string): Observable<ReplyOnPostCommentReaction[]> {
    return this.http.get<ReplyOnPostCommentReaction[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add reaction of reply on post's comment
   * @param replyOnPostCommentReaction - reaction of reply on post's comment will be added
   */
  public addNewReplyOnPostCommentReaction(url, replyOnPostCommentReaction: ReplyOnPostCommentReaction):
    Observable<ReplyOnPostCommentReaction> {
    return this.http.post<ReplyOnPostCommentReaction>(url, replyOnPostCommentReaction, httpOptions);
  }
}
