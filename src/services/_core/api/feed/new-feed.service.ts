import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';
import {NewFeed, ResponseMessage} from '@gw-models/core';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class NewFeedService {

  constructor(private http: HttpClient) {
  }

  /** POST: add new newfeed */
  public addNewFeed(newFeed: NewFeed): Observable<NewFeed> {
    return this.http.post<NewFeed>(`${Config.api}/${Config.apiAddNewFeed}`, newFeed, httpOptions).pipe(
      tap((insertedNewFeed: NewFeed) => console.log(JSON.stringify(insertedNewFeed)))
    );
  }


  /** GET: get new feeds by status and by page */
  public getNewFeedsByStatusAndByPage(url): Observable<NewFeed[]> {
    return this.http.get<NewFeed[]>(
      url, httpOptions).pipe(
      tap((newFeeds: NewFeed[]) => console.log(JSON.stringify(newFeeds)))
    );
  }

  /** GET: get number of new feeds by status */
  public getNumberOfNewFeedsByStatus(url): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(url, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }
}
