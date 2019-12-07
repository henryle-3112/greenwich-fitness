import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FacebookAccount} from '@gw-models';
import {tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class FacebookAccountService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get facebook's account
   */
  public getFacebookAccount(url: string): Observable<FacebookAccount> {
    return this.http.get<FacebookAccount>(url, httpOptions).pipe(
      tap((facebookAccount: FacebookAccount) => console.log(JSON.stringify(facebookAccount)))
    );
  }
}
