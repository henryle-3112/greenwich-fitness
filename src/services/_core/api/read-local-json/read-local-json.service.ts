import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReadLocalJsonService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param localJsonUrl - url of local json
   */
  public getJSON(localJsonUrl): Observable<any> {
    return this.http.get(localJsonUrl);
  }
}
