import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BodyIndex} from '@gw-models';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class BodyIndexService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get body indexes
   */
  public getBodyIndexes(url: string): Observable<BodyIndex[]> {
    return this.http.get<BodyIndex[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to update or create body index
   * @param bodyIndex - created or updated body index
   */
  public updateOrCreateBodyIndex(url: string, bodyIndex: BodyIndex): Observable<BodyIndex> {
    return this.http.post<BodyIndex>(url, bodyIndex, httpOptions);
  }
}
