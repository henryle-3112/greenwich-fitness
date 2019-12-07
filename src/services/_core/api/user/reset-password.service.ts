import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseMessage, UserAccount} from '@gw-models';

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
    return this.http.post<ResponseMessage>(url, email, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to change password
   * @param userAccount - user's account that will be changed its password
   */
  public changePassword(url: string, userAccount: UserAccount): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(url, userAccount, httpOptions);
  }
}
