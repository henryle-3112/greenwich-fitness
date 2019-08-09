import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GoogleAccount} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class GoogleAccountService {

  constructor(private http: HttpClient) {
  }

  /** GET: get google's account by google's id */
  public getGoogleAccountByGoogleId(googleId: string): Observable<GoogleAccount> {
    return this.http.get<GoogleAccount>(`${Config.api}/${Config.apiGetGoogleAccountByGoogleId}/${googleId}`, httpOptions).pipe(
      tap((googleAccount: GoogleAccount) => console.log(JSON.stringify(googleAccount)))
    );
  }
}
