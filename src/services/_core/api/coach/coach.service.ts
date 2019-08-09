import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Coach, ResponseMessage, UserProfile} from '@gw-models/core';
import {tap} from 'rxjs/operators';
import {Config} from '@gw-config/core';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class CoachService {

  constructor(private http: HttpClient) {
  }

  /** GET: get coaches by page based on keywords */
  public getCoachesByPage(url): Observable<Coach[]> {
    return this.http.get<Coach[]>(url, httpOptions).pipe(
      tap((coaches: Coach[]) => console.log(JSON.stringify(coaches)))
    );
  }

  /** GET: get all coaches */
  public getAllCoaches(url): Observable<Coach[]> {
    return this.http.get<Coach[]>(url, httpOptions).pipe(
      tap((coaches: Coach[]) => console.log(JSON.stringify(coaches)))
    );
  }


  /** GET: get total coaches based on keywords */
  public getTotalCoaches(url): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(url, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** GET: get selected coach by user's profile */
  public getCoachByUserProfile(userProfile: UserProfile, status: number): Observable<Coach> {
    return this.http.post<Coach>(`${Config.api}/${Config.apiGetCoachByUserProfile}/${status}`, userProfile, httpOptions).pipe(
      tap((coach: Coach) => console.log(JSON.stringify(coach)))
    );
  }

  /** GET: get coaches by user's profile and by page based on keywords */
  public getCoachesByUserProfileAndByPage(url): Observable<Coach[]> {
    return this.http.get<Coach[]>(url, httpOptions).pipe(
      tap((coaches: Coach[]) => console.log(JSON.stringify(coaches)))
    );
  }

  /** GET: get total coaches by user's profile and by page based on keywords */
  public getTotalCoachesByUserProfileAndByPage(url): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(url, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }
}
