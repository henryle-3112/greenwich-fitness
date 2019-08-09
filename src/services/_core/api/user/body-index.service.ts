import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BodyIndex} from '@gw-models/core';
import {tap} from 'rxjs/operators';
import {Config} from '@gw-config/core';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class BodyIndexService {

  constructor(private http: HttpClient) { }

  /** GET: get body index by user-account's id */
  public getBodyIndexByUserProfileId(url): Observable<BodyIndex[]> {
    return this.http.get<BodyIndex[]>(url, httpOptions).pipe(
      tap((bodyIndex: BodyIndex[]) => console.log(JSON.stringify(bodyIndex)))
    );
  }

  /** POST: update or create body index */
  public updateOrCreateBodyIndex(bodyIndex: BodyIndex): Observable<BodyIndex> {
    return this.http.post<BodyIndex>(`${Config.api}/${Config.apiUpdateBodyIndex}`, bodyIndex, httpOptions).pipe(
      tap((selectedBodyIndex: BodyIndex) => console.log(selectedBodyIndex))
    );
  }
}
