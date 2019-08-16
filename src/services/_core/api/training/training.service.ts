import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Training} from '@gw-models/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'body'
};


@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will used to get trainings
   */
  public getTrainings(url): Observable<HttpResponse<Training[]>> {
    return this.http.get<HttpResponse<Training[]>>(url, httpOptions).pipe(
      tap(response => console.log(response))
    );
  }

  /**
   *
   * @param url - url that will be used to add trainings
   * @param trainings - trainings that will be added
   */
  public addTrainings(url: string, trainings: Training[]): Observable<Training[]> {
    return this.http.post<Training[]>(url, trainings, httpOptions).pipe(
      tap((insertedTrainings: Training[]) => console.log(JSON.stringify(insertedTrainings)))
    );
  }

  /**
   *
   * @param url - url that will be used to update training
   * @param training - training that will be updated
   */
  public updateTrainingStatus(url: string, training: Training): Observable<Training> {
    return this.http.post<Training>(url, training, httpOptions).pipe(
      tap((updatedTraining: Training) => console.log(JSON.stringify(updatedTraining)))
    );
  }
}
