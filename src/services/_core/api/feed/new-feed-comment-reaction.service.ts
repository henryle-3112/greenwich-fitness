import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserProfile, NewFeedCommentReaction, NewFeedComment, ResponseMessage} from '@gw-models/core';
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
export class NewFeedCommentReactionService {

  constructor(private http: HttpClient) {
  }

  /** POST: get new feed comment reactions by user profile */
  public getNewFeedCommentReactionsByUserProfile(userProfile: UserProfile): Observable<NewFeedCommentReaction[]> {
    return this.http.post<NewFeedCommentReaction[]>(
      `${Config.api}/${Config.apiGetNewFeedCommentReactionsByUserProfile}`, userProfile, httpOptions).pipe(
      tap((newFeedCommentReactions: NewFeedCommentReaction[]) => console.log(JSON.stringify(newFeedCommentReactions)))
    );
  }

  /** POST: add new feed comment reaction */
  public addNewFeedCommentReaction(newFeedCommentReaction: NewFeedCommentReaction): Observable<NewFeedCommentReaction> {
    return this.http.post<NewFeedCommentReaction>(
      `${Config.api}/${Config.apiAddNewFeedCommentReaction}`, newFeedCommentReaction, httpOptions).pipe(
      tap((insertedNewFeedCommentReaction: NewFeedCommentReaction) => console.log(JSON.stringify(insertedNewFeedCommentReaction)))
    );
  }

  /** POST: count number of reactions by new feed comment and reaction */
  public countNumberOfNewFeedCommentReactionsByNewFeedCommentAndReaction(
    newFeedComment: NewFeedComment, reaction: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountNumberOfNewFeedCommentReactionsByNewFeedCommentAndReaction}/${reaction}`,
      newFeedComment, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }
}
