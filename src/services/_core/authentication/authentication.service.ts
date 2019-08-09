import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthenticationUser, FacebookAccount, GoogleAccount, UserAccount} from '@gw-models/core';
import {Config} from '@gw-config/core';
// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<AuthenticationUser>;
  public currentUser: Observable<AuthenticationUser>;

  /**
   *
   * @param http - innject http to interact with the server
   */
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<AuthenticationUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthenticationUser {
    return this.currentUserSubject.value;
  }

  /**
   *
   * @param username - user-account's name
   * @param password - user-account's password
   */
  login(username: string, password: string) {
    return this.http.post<any>(`${Config.api}/${Config.apiLogin}`, {userName: username, password: password})
      .pipe(map(response => {
        // login successful if there's a jwt token in the response
        console.log(response);
        const responseJson = JSON.parse(response);
        if (responseJson != null && responseJson.userName != null && responseJson.token != null) {
          this.handleLoginSuccessfully(response);
        }
        return response;
      }));
  }

  /**
   *
   * @param facebookAccount - facebookAccount to authenticate
   */
  loginByFacebook(facebookAccount: FacebookAccount) {
    return this.http.post<any>(`${Config.api}/${Config.apiLoginByFacebook}`, facebookAccount, httpOptions)
      .pipe(map(response => {
        // login successful if there's a jwt token in the response
        console.log(response);
        const data = JSON.parse(response);
        if (data.message && data.message.localeCompare('failure') === 0) {
          return response;
        } else {
          this.handleLoginSuccessfully(response);
        }
        return response;
      }));
  }

  /**
   *
   * @param googleAccount - googleAccount to authenticate
   */
  loginByGoogle(googleAccount: GoogleAccount) {
    return this.http.post<any>(`${Config.api}/${Config.apiLoginByGoogle}`, googleAccount, httpOptions)
      .pipe(map(response => {
        // login successful if there's a jwt token in the response
        console.log(response);
        const data = JSON.parse(response);
        if (data.message && data.message.localeCompare('failure') === 0) {
          return response;
        } else {
          this.handleLoginSuccessfully(response);
        }
        return response;
      }));
  }

  /**
   * logout
   */
  logout() {
    // remove user-account from local storage to log user-account out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   *
   * @param response - get user-account's information
   */
  private handleLoginSuccessfully(response: any) {
    // get user-account's information and token.
    const selectedUser = JSON.parse(response);
    const authenticationUser = new AuthenticationUser();
    authenticationUser.userName = selectedUser.userName;
    authenticationUser.token = selectedUser.token;
    // get user-account's roles
    authenticationUser.roles = selectedUser.roles[0];
    for (let i = 1; i < selectedUser.roles.length; i++) {
      if (i !== selectedUser.roles.length - 1) {
        authenticationUser.roles = authenticationUser.roles + selectedUser.roles[i] + ', ';
      } else {
        authenticationUser.roles = authenticationUser.roles + selectedUser.roles[i];
      }
    }
    console.log(JSON.stringify(authenticationUser));
    // store user-account details and jwt token in local storage to keep user-account logged in between page refreshes
    localStorage.setItem('currentUser', JSON.stringify(authenticationUser));
    this.currentUserSubject.next(authenticationUser);
  }
}
