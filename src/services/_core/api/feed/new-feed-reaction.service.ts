import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NewFeedReaction} from '@gw-models/core';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class NewFeedReactionService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get newfeed's reactions
   */
  public getNewFeedReactions(url: string): Observable<NewFeedReaction[]> {
    return this.http.get<NewFeedReaction[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add newfeed's reaction
   * @param newFeedReaction - reactions of newfeed that will be added
   */
  public addNewFeedReaction(url: string, newFeedReaction: NewFeedReaction): Observable<NewFeedReaction> {
    return this.http.post<NewFeedReaction>(url, newFeedReaction, httpOptions);
  }
}
