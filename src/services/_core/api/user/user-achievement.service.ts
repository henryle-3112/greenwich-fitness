import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ResponseMessage, UserAccount, UserAchievement} from '@gw-models/core';
import {Config} from '@gw-config/core';
// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserAchievementService {

  constructor(private http: HttpClient) {
  }

  /** GET: get user-account's achievements by page */
  public getUserAchievemnetsByPage(url): Observable<UserAchievement[]> {
    return this.http.get<UserAchievement[]>(url, httpOptions).pipe(
      tap((userAchievements: UserAchievement[]) => console.log(JSON.stringify(userAchievements)))
    );
  }

  /** GET: get total user-account's achievements */
  public getTotalUserAchievements(url): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(url, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** POST: add new achievement */
  public addUserAchievement(userAchievement: UserAchievement): Observable<UserAchievement> {
    return this.http.post<UserAchievement>(`${Config.api}/${Config.apiAddToAchievement}`, userAchievement, httpOptions).pipe(
      tap((selectedUserAchievement: UserAchievement) => console.log(JSON.stringify(selectedUserAchievement)))
    );
  }
}
