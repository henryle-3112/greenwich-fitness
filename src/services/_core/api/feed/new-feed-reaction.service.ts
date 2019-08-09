import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NewFeed, NewFeedReaction, ResponseMessage, UserProfile} from '@gw-models/core';
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
export class NewFeedReactionService {

  constructor(private http: HttpClient) {
  }

  /** POST: count number of new's feed's reactions */
  public countNumberOfNewFeedReactions(newFeed: NewFeed, reaction: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountNumberOfNewFeedReactions}/${reaction}`, newFeed, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** POST: get new's feed's reactions by user's profile */
  public getNewFeedReactionsByUserProfile(userProfile: UserProfile): Observable<NewFeedReaction[]> {
    return this.http.post<NewFeedReaction[]>(
      `${Config.api}/${Config.apiGetNewFeedReactionsByUserProfile}`, userProfile, httpOptions).pipe(
      tap((newFeedReactions: NewFeedReaction[]) => console.log(JSON.stringify(newFeedReactions)))
    );
  }

  /** POST: add new new's feed's reaction */
  public addNewFeedReaction(newFeedReaction: NewFeedReaction): Observable<NewFeedReaction> {
    return this.http.post<NewFeedReaction>(
      `${Config.api}/${Config.apiAddNewFeedReaction}`, newFeedReaction, httpOptions).pipe(
      tap((insertedNewFeedReaction: NewFeedReaction) => console.log(JSON.stringify(insertedNewFeedReaction)))
    );
  }
}
