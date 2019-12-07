import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserProfile} from '@gw-models';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to update user's profile
   * @param userProfile - user's profile that will be updated
   */
  public updateUserProfile(url: string, userProfile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(url, userProfile, httpOptions);
  }
}
