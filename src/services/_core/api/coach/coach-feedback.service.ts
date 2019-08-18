import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CoachFeedback} from '@gw-models/core';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class CoachFeedbackService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get coach's feedbacks
   */
  public getCoachFeedbacks(url): Observable<CoachFeedback[]> {
    return this.http.get<CoachFeedback[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add coach's feedback
   * @param coachFeedback - coach's feedback that will be added
   */
  public addCoachFeedback(url: string, coachFeedback: CoachFeedback): Observable<CoachFeedback> {
    return this.http.post<CoachFeedback>(url, coachFeedback, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to update coach's feedback
   * @param coachFeedback - coach's feedback that will be updated
   */
  public updateCoachFeedback(url: string, coachFeedback: CoachFeedback): Observable<CoachFeedback> {
    return this.http.put<CoachFeedback>(url, coachFeedback, httpOptions);
  }
}
