import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Config} from '../../../../config/config';
import {tap} from 'rxjs/operators';
import {ResponseMessage} from '../../../../models/response/response-message';
import {UserAccount} from '../../../../models/user/user-account';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})

export class ResetPasswordService {
  constructor(private http: HttpClient) {
  }

  /** POST: send email to server to get token to reset password */
  public sendEmailToResetPassword(email: string): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${Config.api}/${Config.apiSendEmailResetPassword}`, email, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(responseMessage.message))
    );
  }

  /** POST: change password to the server */
  public changePassword(userAccount: UserAccount): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${Config.api}/${Config.apiChangePassword}`, userAccount, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(responseMessage.message))
    );
  }
}
