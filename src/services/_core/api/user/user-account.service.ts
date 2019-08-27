import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAccount } from '@gw-models/core';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used get user's account
   */
  public getUserAccount(url): Observable<UserAccount> {
    return this.http.get<UserAccount>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to update user's account
   * @param userAccount - user's account that will be updated
   */
  public updateUserAccount(url: string, userAccount: UserAccount): Observable<UserAccount> {
    return this.http.put<UserAccount>(url, userAccount, httpOptions);
  }
}
