import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserAccount} from '@gw-models/core';
import {tap} from 'rxjs/operators';
import {Config} from '@gw-config/core';
// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  constructor(private http: HttpClient) {
  }

  /** GET: get user-account's account by user-account's name */
  public getUserAccountByUsername(url): Observable<UserAccount> {
    return this.http.get<UserAccount>(url, httpOptions).pipe(
      tap((userAccount: UserAccount) => console.log(JSON.stringify(userAccount)))
    );
  }

  /** POST: update user-account's account */
  public updateUserAccount(userAccount: UserAccount): Observable<UserAccount> {
    return this.http.post<UserAccount>(`${Config.api}/${Config.apiUpdateUserAccount}`, userAccount, httpOptions).pipe(
      tap((updatedUserAccount: UserAccount) => console.log(JSON.stringify(updatedUserAccount)))
    );
  }
}
