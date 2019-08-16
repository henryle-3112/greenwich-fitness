import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthenticationUser, FacebookAccount, GoogleAccount} from '@gw-models/core';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<AuthenticationUser>;
  public currentUser: Observable<AuthenticationUser>;


  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<AuthenticationUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * return current authenticated user
   */
  public get currentUserValue(): AuthenticationUser {
    return this.currentUserSubject.value;
  }

  /**
   *
   * @param url - url that will be used to login
   * @param username - user's name that will be used to login
   * @param password - user's password that will be used to login
   */
  login(url: string, username: string, password: string) {
    return this.http.post<any>(url, {userName: username, password: password})
      .pipe(map(response => {
        const responseJson = JSON.parse(response);
        if (responseJson != null && responseJson.userName != null && responseJson.token != null) {
          this.handleLoginSuccessfully(response);
        }
        return response;
      }));
  }

  /**
   *
   * @param url - url that will be used to authenticate facebook's account
   * @param facebookAccount - facebook's account that will be authenticated
   */
  loginByFacebook(url: string, facebookAccount: FacebookAccount) {
    return this.http.post<any>(url, facebookAccount, httpOptions)
      .pipe(map(response => {
        // login successful if there's a jwt token in the response
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
   * @param url - url that will be used to authenticate google's account
   * @param googleAccount - google's account that will be authenticated
   */
  loginByGoogle(url: string, googleAccount: GoogleAccount) {
    return this.http.post<any>(url, googleAccount, httpOptions)
      .pipe(map(response => {
        // login successful if there's a jwt token in the response
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
    localStorage.setItem('currentUser', JSON.stringify(authenticationUser));
    this.currentUserSubject.next(authenticationUser);
  }
}
