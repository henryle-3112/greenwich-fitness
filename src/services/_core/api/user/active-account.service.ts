import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {UserAccount, ResponseMessage} from '@gw-models/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ActiveAccountService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used tot active user's account
   * @param userAccount - user's account that will be activated
   */
  public activeAccount(url: string, userAccount: UserAccount): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(url, userAccount, httpOptions);
  }
}
