import {Injectable} from '@angular/core';
import {Coach, Membership} from '@gw-models';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

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
export class MembershipService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get memberships
   */
  public getMemberships(url): Observable<HttpResponse<Membership[]>> {
    return this.http.get<HttpResponse<Membership[]>>(url, httpFullOptions);
  }

  /**
   *
   * @param url - url that will be used to get coaches
   */
  public getCoaches(url): Observable<HttpResponse<Coach[]>> {
    return this.http.get<HttpResponse<Coach[]>>(url, httpFullOptions);
  }

  /**
   *
   * @param url - url that user want to get selected membership
   */
  public getMembership(url: string): Observable<Membership> {
    return this.http.get<Membership>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used tot add membership
   * @param membership - membership that will be added
   */
  public addMembership(url: string, membership: Membership) {
    return this.http.post<Membership>(url, membership, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to update membership
   * @param membership - membership that will be updated
   */
  public updateMembership(url: string, membership: Membership) {
    return this.http.post<Membership>(url, membership, httpOptions);
  }
}
