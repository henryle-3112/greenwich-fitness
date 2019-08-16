import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {
  CoachFeedbackReaction,
} from '@gw-models/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class CoachFeedbackReactionService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get reactions of coach's feedback
   */
  public getCoachFeedbackReactions(url: string): Observable<CoachFeedbackReaction[]> {
    return this.http.get<CoachFeedbackReaction[]>(url, httpOptions).pipe(
      tap((coachFeedbackReactions: CoachFeedbackReaction[]) => console.log(JSON.stringify(coachFeedbackReactions)))
    );
  }

  /**
   *
   * @param url - url that will be used to add coach's feedback' reaction
   * @param coachFeedbackReaction - reaction of coach's feedback that will be added
   */
  public addCoachFeedbackReaction(url: string, coachFeedbackReaction: CoachFeedbackReaction): Observable<CoachFeedbackReaction> {
    return this.http.post<CoachFeedbackReaction>(url, coachFeedbackReaction, httpOptions).pipe(
      tap((insertedCoachFeedbackReaction: CoachFeedbackReaction) => console.log(JSON.stringify(insertedCoachFeedbackReaction)))
    );
  }
}
