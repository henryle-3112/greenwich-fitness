import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {UserAccount, ResponseMessage} from '@gw-models/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ActiveAccountService {

  constructor(private http: HttpClient) {
  }

  /** POST: active account */
  public activeAccount(userAccount: UserAccount): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${Config.api}/${Config.apiActiveAccount}`, userAccount, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(responseMessage.message))
    );
  }
}
