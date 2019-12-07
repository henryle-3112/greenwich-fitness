import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Training} from '@gw-models';
import {Observable} from 'rxjs';

const httpFullOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'body'
};

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
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
    return this.http.get<HttpResponse<Training[]>>(url, httpFullOptions);
  }

  /**
   *
   * @param url - url that will be used to add trainings
   * @param trainings - trainings that will be added
   */
  public addTrainings(url: string, trainings: Training[]): Observable<Training[]> {
    return this.http.post<Training[]>(url, trainings, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to update training
   * @param training - training that will be updated
   */
  public updateTraining(url: string, training: Training): Observable<Training> {
    return this.http.put<Training>(url, training, httpOptions);
  }
}
