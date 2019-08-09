import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NewFeed, NewFeedComment, ResponseMessage} from '@gw-models/core';
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
export class NewFeedCommentService {

  constructor(private http: HttpClient) {
  }

  /** POST: add new newfeed */
  public getNewFeedCommentsByNewFeedAndStatus(newFeed: NewFeed, status: number): Observable<NewFeedComment[]> {
    return this.http.post<NewFeedComment[]>(
      `${Config.api}/${Config.apiGetNewFeedCommentsByNewFeedAndStatus}/${status}`, newFeed, httpOptions).pipe(
      tap((newFeedComments: NewFeedComment[]) => console.log(JSON.stringify(newFeedComments)))
    );
  }

  /** POST: add new new feed comment */
  public addNewFeedComment(newFeedComment: NewFeedComment): Observable<NewFeedComment> {
    return this.http.post<NewFeedComment>(
      `${Config.api}/${Config.apiAddNewFeedComment}`, newFeedComment, httpOptions).pipe(
      tap((insertedNewFeedComment: NewFeedComment) => console.log(JSON.stringify(insertedNewFeedComment)))
    );
  }

  /** POST: add new new feed comment */
  public countNumberOfNewFeedCommentsByNewFeedAndByStatus(newFeed: NewFeed, status: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountNumberOfNewFeedCommentsByNewFeedAndByStatus}/${status}`, newFeed, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }
}
