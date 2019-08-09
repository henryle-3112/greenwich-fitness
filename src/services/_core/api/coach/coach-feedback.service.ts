import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Coach, CoachFeedback} from '@gw-models/core';
import {Observable} from 'rxjs';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class CoachFeedbackService {

  constructor(private http: HttpClient) {
  }

  /** POST: get coach's feedbacks by coach */
  public getCoachFeedbacksByCoach(coach: Coach, status: number): Observable<CoachFeedback[]> {
    return this.http.post<CoachFeedback[]>(`${Config.api}/${Config.apiGetCoachFeedback}/${status}`, coach, httpOptions).pipe(
      tap((coachFeedbacks: CoachFeedback[]) => console.log(JSON.stringify(coachFeedbacks)))
    );
  }

  /** POST: add new coach's feedback */
  public addCoachFeedback(coachFeedback: CoachFeedback): Observable<CoachFeedback> {
    return this.http.post<CoachFeedback>(`${Config.api}/${Config.apiAddCoachFeedback}`, coachFeedback, httpOptions).pipe(
      tap((insertedCoachFeedback: CoachFeedback) => console.log(JSON.stringify(insertedCoachFeedback)))
    );
  }
}
