import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResponseMessage, Training} from '@gw-models/core';
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
export class TrainingService {

  constructor(private http: HttpClient) {
  }

  /** GET: get trainings by user's profile and by coach */
  public getTrainingsByUserProfileAndByCoachAndPage(url): Observable<Training[]> {
    return this.http.get<Training[]>(
      url, httpOptions).pipe(
      tap((trainings: Training[]) => console.log(JSON.stringify(trainings)))
    );
  }

  /** GET: count number of trainings by user's profile and by coach */
  public countNumberOfTrainingsByUserProfileAndByCoach(url): Observable<ResponseMessage> {
    return this.http.get <ResponseMessage>(
      url, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** POST: add new trainings */
  public addTrainings(trainings: Training[]): Observable<Training[]> {
    return this.http.post<Training[]>(`${Config.api}/${Config.apiAddTraining}`, trainings, httpOptions).pipe(
      tap((insertedTrainings: Training[]) => console.log(JSON.stringify(insertedTrainings)))
    );
  }

  /** POST: get trainings by user's profile and coach and training's date */
  public getTrainingsByUserProfileIdAndCoachIdAndTrainingDate(
    userProfileId: number, coachId: number, trainingDate: string): Observable<Training[]> {
    return this.http.post<Training[]>(
      `${Config.api}/${Config.apiGetTrainingsByUserProfileAndCoachAndTrainingDate}/${userProfileId}/${coachId}`,
      trainingDate, httpOptions).pipe(
      tap((trainings: Training[]) => console.log(JSON.stringify(trainings)))
    );
  }

  /** POST: update training status when user finished a single exercise or workout*/
  public updateTrainingStatus(training: Training): Observable<Training> {
    return this.http.post<Training>(
      `${Config.api}/${Config.apiUpdateTrainingStatus}`,
      training, httpOptions).pipe(
      tap((updatedTraining: Training) => console.log(JSON.stringify(updatedTraining)))
    );
  }
}
