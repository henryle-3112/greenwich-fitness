import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Coach} from '@gw-models/core';

const httpFullOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'body'
};

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class CoachService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get coaches
   */
  public getCoaches(url: string): Observable<HttpResponse<Coach[]>> {
    return this.http.get<HttpResponse<Coach[]>>(url, httpFullOptions);
  }

  /**
   *
   * @param url - url that will be used to get selected coach
   */
  public getCoach(url: string): Observable<Coach> {
    return this.http.get<Coach>(url, httpOptions);
  }
}
