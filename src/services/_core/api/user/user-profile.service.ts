import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {UserProfile} from '@gw-models/core';

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
    return this.http.post<UserProfile>(url, userProfile, httpOptions).pipe(
      tap((updatedUserProfile: UserProfile) => console.log(JSON.stringify(updatedUserProfile)))
    );
  }
}
