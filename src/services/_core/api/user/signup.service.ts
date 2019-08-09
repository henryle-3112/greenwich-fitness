import {tap} from 'rxjs/operators';
import {Config} from '../../../../config/config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserAccount, ResponseMessage} from '@gw-models/core';
import {Injectable} from '@angular/core';
// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) {
  }

  /** POST: sign up new user-account's account */
  public signUp(userAccount: UserAccount): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${Config.api}/${Config.apiRegisterAccount}`, userAccount, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(responseMessage.message))
    );
  }
}
