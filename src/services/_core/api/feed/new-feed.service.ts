import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewFeed } from '@gw-models/core';

const httpFullOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'body'
};

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class NewFeedService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to add newfeed
   * @param newFeed - newfeed that will be added
   */
  public addNewFeed(url: string, newFeed: NewFeed): Observable<NewFeed> {
    return this.http.post<NewFeed>(url, newFeed, httpOptions);
  }


  /** GET: get new feeds by status and by page */
  public getNewFeeds(url): Observable<HttpResponse<NewFeed[]>> {
    return this.http.get<HttpResponse<NewFeed[]>>(url, httpFullOptions);
  }

  /**
   *
   * @param url - url that will be used to update newfeed
   * @param newFeed - newfeed that will be updated
   */
  public updateNewFeed(url: string, newFeed: NewFeed): Observable<NewFeed> {
    return this.http.put<NewFeed>(url, newFeed, httpOptions);
  }
}
