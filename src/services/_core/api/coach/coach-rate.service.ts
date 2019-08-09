import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CoachRate, ResponseMessage} from '@gw-models/core';
import {tap} from 'rxjs/operators';
import {Config} from '@gw-config/core';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class CoachRateService {

  constructor(private http: HttpClient) {
  }

  /** GET: get total coaches based on keywords */
  public getCoachRateAverage(coachId: number): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(`${Config.api}/${Config.apiRateAverage}/${coachId}`, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** GET: get coach's rate by user's id and coach's id */
  public getCoachRateByUserIdAndCoachId(userId: number, coachId: number): Observable<CoachRate> {
    return this.http.get<CoachRate>(
      `${Config.api}/${Config.apiGetCoachRateByUserIdAndCoachId}/${userId}/${coachId}`, httpOptions).pipe(
      tap((coachRate: CoachRate) => console.log(JSON.stringify(coachRate)))
    );
  }

  /** POST: add new coach's rate */
  public addCoachRate(coachRate: CoachRate): Observable<CoachRate> {
    return this.http.post<CoachRate>(`${Config.api}/${Config.apiAddCoachRate}`, coachRate, httpOptions).pipe(
      tap((insertedCoachRate: CoachRate) => console.log(JSON.stringify(insertedCoachRate)))
    );
  }
}
