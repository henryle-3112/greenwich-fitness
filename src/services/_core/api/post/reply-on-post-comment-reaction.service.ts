import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';
import {ReplyOnPostComment, ReplyOnPostCommentReaction, ResponseMessage, UserProfile} from '@gw-models/core';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ReplyOnPostCommentReactionService {

  constructor(private http: HttpClient) {
  }

  /** POST: count number of reply on post's comment reaction */
  public countNumberOfReplyOnPostCommentReaction(
    replyOnPostComment: ReplyOnPostComment, reactionType: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountReplyOnPostCommentReaction}/${reactionType}`, replyOnPostComment, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** POST: get reply on post comment reactions by user's profile */
  public getReplyOnPostCommentReactionsByUserProfile(userProfile: UserProfile): Observable<ReplyOnPostCommentReaction[]> {
    return this.http.post<ReplyOnPostCommentReaction[]>(
      `${Config.api}/${Config.apiGetReplyOnPostCommentReaction}`, userProfile, httpOptions).pipe(
      tap((replyOnPostCommentReactions: ReplyOnPostCommentReaction[]) => console.log(JSON.stringify(replyOnPostCommentReactions)))
    );
  }

  /** POST: add new reply on post comment reaction */
  public addNewReplyOnPostCommentReaction(
    replyOnPostCommentReaction: ReplyOnPostCommentReaction): Observable<ReplyOnPostCommentReaction> {
    return this.http.post<ReplyOnPostCommentReaction>(
      `${Config.api}/${Config.apiAddNewReplyOnPostCommentReaction}`, replyOnPostCommentReaction, httpOptions).pipe(
      tap(
        (insertedReplyOnPostCommentReaction: ReplyOnPostCommentReaction) =>
          console.log(JSON.stringify(insertedReplyOnPostCommentReaction)))
    );
  }
}
