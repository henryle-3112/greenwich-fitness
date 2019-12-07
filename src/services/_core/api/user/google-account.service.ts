import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GoogleAccount} from '@gw-models';
import {tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class GoogleAccountService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get google's account
   */
  public getGoogleAccount(url: string): Observable<GoogleAccount> {
    return this.http.get<GoogleAccount>(url, httpOptions).pipe(
      tap((googleAccount: GoogleAccount) => console.log(JSON.stringify(googleAccount)))
    );
  }
}
