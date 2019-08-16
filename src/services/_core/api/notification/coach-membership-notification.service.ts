import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CoachMembershipNotification} from '@gw-models/core';
import {tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'body'
};

@Injectable({
  providedIn: 'root'
})
export class CoachMembershipNotificationService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be get coach membership notifications
   */
  public getCoachMembershipNotifications(url: string): Observable<HttpResponse<CoachMembershipNotification[]>> {
    return this.http.get<HttpResponse<CoachMembershipNotification[]>>(url, httpOptions).pipe(
      tap(response => console.log(response))
    );
  }

  /**
   *
   * @param url - url that will be used to get coach membership notification
   * @param coachMembershipNotification - coach membership notification that will be added
   */
  public addCoachMembershipNotification(url: string, coachMembershipNotification: CoachMembershipNotification):
    Observable<CoachMembershipNotification> {
    return this.http.post<CoachMembershipNotification>(url, coachMembershipNotification, httpOptions).pipe(
      tap((insertedCoachMembershipNotification: CoachMembershipNotification) => {
        console.log(JSON.stringify(insertedCoachMembershipNotification));
      })
    );
  }

  /**
   *
   * @param url - url that will be used to update coach membership notification
   * @param coachMembershipNotification - coach membership notification that will be updated
   */
  public updateCoachMembershipNotification(url: string, coachMembershipNotification: CoachMembershipNotification):
    Observable<CoachMembershipNotification> {
    return this.http.put<CoachMembershipNotification>(url, coachMembershipNotification, httpOptions).pipe(
      tap((updatedCoachMembershipNotification: CoachMembershipNotification) => {
        console.log(JSON.stringify(updatedCoachMembershipNotification));
      })
    );
  }

  /**
   *
   * @param url - url that will be used to get coach membership notification
   */
  public getCoachMembershipNotification(url: string): Observable<CoachMembershipNotification> {
    return this.http.get<CoachMembershipNotification>(url, httpOptions).pipe(
      tap((coachMembershipNotification: CoachMembershipNotification) => console.log(JSON.stringify(coachMembershipNotification)))
    );
  }
}
