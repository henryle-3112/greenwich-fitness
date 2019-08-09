import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CoachMembershipNotification, ResponseMessage} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class CoachMembershipNotificationService {

  constructor(private http: HttpClient) {
  }

  /** GET: get notifications by coach id and by page and by keyword */
  public getCoachMembershipNotificationsByCoachIdAndByPageAndByKeyword(url: string): Observable<CoachMembershipNotification[]> {
    return this.http.get<CoachMembershipNotification[]>(
      url,
      httpOptions).pipe(
      tap((coachMembershipNotifications: CoachMembershipNotification[]) => console.log(JSON.stringify(coachMembershipNotifications)))
    );
  }

  /** GET: get number of notifications by coach id and by page and by keyword */
  public getNumberOfCoachMembershipNotificationsByCoachIdAndByPageAndByKeyword(url): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(
      url,
      httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** GET: get notifications by user profile id and by page and by keyword */
  public getCoachMembershipNotificationsByUserProfileIdAndByPageAndByKeyword(url: string): Observable<CoachMembershipNotification[]> {
    return this.http.get<CoachMembershipNotification[]>(
      url,
      httpOptions).pipe(
      tap((coachMembershipNotifications: CoachMembershipNotification[]) => console.log(JSON.stringify(coachMembershipNotifications)))
    );
  }

  /** GET: get number of notifications by uer profile id and by page and by keyword */
  public getNumberOfCoachMembershipNotificationsByUserProfileIdAndByPageAndByKeyword(url): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(
      url,
      httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** POST: add new coach membership notification */
  public addCoachMembershipNotification(coachMembershipNotification: CoachMembershipNotification): Observable<CoachMembershipNotification> {
    return this.http.post<CoachMembershipNotification>(
      `${Config.api}/${Config.apiAddCoachMembershipNotification}`, coachMembershipNotification, httpOptions).pipe(
      tap((insertedCoachMembershipNotification: CoachMembershipNotification) => {
        console.log(JSON.stringify(insertedCoachMembershipNotification));
      })
    );
  }

  /** POST: update coach membership notification */
  public updateCoachMembershipNotification(
    coachMembershipNotification: CoachMembershipNotification): Observable<CoachMembershipNotification> {
    return this.http.post<CoachMembershipNotification>(
      `${Config.api}/${Config.apiUpdateCoachMembershipNotification}`, coachMembershipNotification, httpOptions).pipe(
      tap((updatedCoachMembershipNotificaiton: CoachMembershipNotification) => {
        console.log(JSON.stringify(updatedCoachMembershipNotificaiton));
      })
    );
  }

  /** GET: get coach membership notification by user profile id and coach id and by status*/
  public getCoachMembershipNotificationByUserProfileIdAndByCoachIdAndByStatus(
    userProfileId: number,
    coachId: number,
    status: number
  ): Observable<CoachMembershipNotification> {
    return this.http.get<CoachMembershipNotification>(
      `${Config.api}/${Config.apiGetCoachMembershipNotificationByUserProfileIdAndByCoachIdAndByStatus}/${userProfileId}/${coachId}/${status}`,
      httpOptions).pipe(
      tap((coachMembershipNotification: CoachMembershipNotification) => console.log(JSON.stringify(coachMembershipNotification)))
    );
  }
}
