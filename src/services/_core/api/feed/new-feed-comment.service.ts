import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NewFeedComment} from '@gw-models/core';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class NewFeedCommentService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get newfeed's comments
   */
  public getNewFeedComments(url: string): Observable<NewFeedComment[]> {
    return this.http.get<NewFeedComment[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add newfeed's comment
   * @param newFeedComment - newfeed's comment that will be added
   */
  public addNewFeedComment(url: string, newFeedComment: NewFeedComment): Observable<NewFeedComment> {
    return this.http.post<NewFeedComment>(url, newFeedComment, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to update newfeed's comment
   * @param newFeedComment - newfeed's comment that will be updated
   */
  public updateNewFeedComment(url: string, newFeedComment: NewFeedComment): Observable<NewFeedComment> {
    return this.http.put<NewFeedComment>(url, newFeedComment, httpOptions);
  }
}
