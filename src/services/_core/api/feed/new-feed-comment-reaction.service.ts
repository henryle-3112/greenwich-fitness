import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NewFeedCommentReaction} from '@gw-models';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class NewFeedCommentReactionService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get reactions of newfeed's comments
   */
  public getNewFeedCommentReactions(url: string): Observable<NewFeedCommentReaction[]> {
    return this.http.get<NewFeedCommentReaction[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add reaction of newfeed's comment
   * @param newFeedCommentReaction - reaction of newfeed's comment that will be added
   */
  public addNewFeedCommentReaction(url: string, newFeedCommentReaction: NewFeedCommentReaction): Observable<NewFeedCommentReaction> {
    return this.http.post<NewFeedCommentReaction>(url, newFeedCommentReaction, httpOptions);
  }
}
