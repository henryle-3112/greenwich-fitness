import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CoachRate} from '@gw-models/core';
import {tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class CoachRateService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get coach's rate
   */
  public getCoachRate(url: string): Observable<CoachRate> {
    return this.http.get<CoachRate>(url, httpOptions).pipe(
      tap((coachRate: CoachRate) => console.log(JSON.stringify(coachRate)))
    );
  }

  /**
   *
   * @param url - url that will be used to add coach's rate
   * @param coachRate - coach's rate that will be added
   */
  public addCoachRate(url: string, coachRate: CoachRate): Observable<CoachRate> {
    return this.http.post<CoachRate>(url, coachRate, httpOptions).pipe(
      tap((insertedCoachRate: CoachRate) => console.log(JSON.stringify(insertedCoachRate)))
    );
  }
}
