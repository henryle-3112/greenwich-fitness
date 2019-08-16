import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ResponseMessage} from '@gw-models/core';
import {UserAccount} from '@gw-models/core';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})

export class ResetPasswordService {
  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to send email reset password
   * @param email - email that will be received email reset password
   */
  public sendEmailToResetPassword(url: string, email: string): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(url, email, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(responseMessage.message))
    );
  }

  /**
   *
   * @param url - url that will be used to change password
   * @param userAccount - user's account that will be changed its password
   */
  public changePassword(url: string, userAccount: UserAccount): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(url, userAccount, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(responseMessage.message))
    );
  }
}
