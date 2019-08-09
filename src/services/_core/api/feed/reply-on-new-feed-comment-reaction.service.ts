import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {
  ReplyOnNewFeedComment,
  ReplyOnNewFeedCommentReaction,
  ResponseMessage,
  UserProfile
} from '@gw-models/core';
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
export class ReplyOnNewFeedCommentReactionService {

  constructor(private http: HttpClient) {
  }

  /** POST: get reply on new feed comment reactions by user profile */
  public getReplyOnNewFeedCommentReactionsByUserProfile(userProfile: UserProfile): Observable<ReplyOnNewFeedCommentReaction[]> {
    return this.http.post<ReplyOnNewFeedCommentReaction[]>(
      `${Config.api}/${Config.apiGetReplyOnNewFeedCommentReactionByUserProfile}`, userProfile, httpOptions).pipe(
      tap((replyOnNewFeedCommentReactions: ReplyOnNewFeedCommentReaction[]) => console.log(JSON.stringify(replyOnNewFeedCommentReactions)))
    );
  }

  /** POST: add new reply on new feed comment reaction */
  public addReplyOnNewFeedCommentReaction(
    replyOnNewFeedCommentReaction: ReplyOnNewFeedCommentReaction): Observable<ReplyOnNewFeedCommentReaction> {
    return this.http.post<ReplyOnNewFeedCommentReaction>(
      `${Config.api}/${Config.apiAddReplyOnNewFeedCommentReaction}`, replyOnNewFeedCommentReaction, httpOptions).pipe(
      tap((insertedReplyOnNewFeedCommentReaction: ReplyOnNewFeedCommentReaction) => {
        console.log(JSON.stringify(insertedReplyOnNewFeedCommentReaction));
      })
    );
  }

  /** POST: cout number of reply on new feed comment reactions by reply on new feed comment and reaction */
  public countNumberOfNewFeedCommentReactionsByReplyOnNewFeedCommentAndReaction(
    replyOnNewFeedComment: ReplyOnNewFeedComment, reaction: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountNumberOfNewFeedCommentReactionsByReplyOnNewFeedCommentAndReaction}/${reaction}`,
      replyOnNewFeedComment, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }
}
