import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseMessage, UserAccount} from '@gw-models';
import {Injectable} from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to register new account
   * @param userAccount - user's account that will be register
   */
  public signUp(url: string, userAccount: UserAccount): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(url, userAccount, httpOptions);
  }
}
