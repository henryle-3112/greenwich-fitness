import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FacebookAccount} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class FacebookAccountService {

  constructor(private http: HttpClient) { }

  /** GET: get facebook's account by facebook's id */
  public getFacebookAccountByFacebookId(facebookId: string): Observable<FacebookAccount> {
    return this.http.get<FacebookAccount>(`${Config.api}/${Config.apiGetFacebookAccountByFacebookId}/${facebookId}`, httpOptions).pipe(
      tap((facebookAccount: FacebookAccount) => console.log(JSON.stringify(facebookAccount)))
    );
  }
}
