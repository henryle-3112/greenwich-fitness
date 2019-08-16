import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserAchievement} from '@gw-models/core';

const httpFullOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'body'
};

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserAchievementService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get user's achievements
   */
  public getUserAchievements(url): Observable<HttpResponse<UserAchievement[]>> {
    return this.http.get<HttpResponse<UserAchievement[]>>(url, httpFullOptions);
  }

  /**
   *
   * @param url - url that will be used to add user's achievement
   * @param userAchievement - user's achievement that will be added
   */
  public addUserAchievement(url: string, userAchievement: UserAchievement): Observable<UserAchievement> {
    return this.http.post<UserAchievement>(url, userAchievement, httpOptions);
  }
}
