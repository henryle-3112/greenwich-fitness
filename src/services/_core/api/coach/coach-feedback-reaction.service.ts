import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {
  CoachFeedback,
  CoachFeedbackReaction,
  ResponseMessage,
  UserProfile
} from '@gw-models/core';
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
export class CoachFeedbackReactionService {

  constructor(private http: HttpClient) {
  }

  /** POST: count number of coach feedback reactions */
  public countNumberOfCoachFeedbackReactions(coachFeedback: CoachFeedback, reactionType: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountCoachFeedbackReaction}/${reactionType}`, coachFeedback, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** POST: get coach's feedback reaction by user's profile */
  public getCoachFeedbackReactionsByUserProfile(userProfile: UserProfile): Observable<CoachFeedbackReaction[]> {
    return this.http.post<CoachFeedbackReaction[]>(
      `${Config.api}/${Config.apiGetCoachFeedbackReactionsByUserProfile}`, userProfile, httpOptions).pipe(
      tap((coachFeedbackReactions: CoachFeedbackReaction[]) => console.log(JSON.stringify(coachFeedbackReactions)))
    );
  }

  /** POST: add new coach feedback reaction */
  public addCoachFeedbackReaction(coachFeedbackReaction: CoachFeedbackReaction): Observable<CoachFeedbackReaction> {
    return this.http.post<CoachFeedbackReaction>(
      `${Config.api}/${Config.apiAddNewCoachFeedbackReaction}`, coachFeedbackReaction, httpOptions).pipe(
      tap((insertedCoachFeedbackReaction: CoachFeedbackReaction) => console.log(JSON.stringify(insertedCoachFeedbackReaction)))
    );
  }
}
