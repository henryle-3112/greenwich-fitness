import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Config} from '@gw-config/core';
import {UserProfile} from '@gw-models/core';
// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private http: HttpClient) {
  }

  /** POST: update user-account's profile */
  public updateUserProfile(userProfile: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${Config.api}/${Config.apiUpdateUserProfile}`, userProfile, httpOptions).pipe(
      tap((updatedUserProfile: UserProfile) => console.log(JSON.stringify(updatedUserProfile)))
    );
  }
}
