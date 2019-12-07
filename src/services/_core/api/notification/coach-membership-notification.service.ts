import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CoachMembershipNotification} from '@gw-models';

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
export class CoachMembershipNotificationService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be get coach membership notifications
   */
  public getCoachMembershipNotifications(url: string): Observable<HttpResponse<CoachMembershipNotification[]>> {
    return this.http.get<HttpResponse<CoachMembershipNotification[]>>(url, httpFullOptions);
  }

  /**
   *
   * @param url - url that will be used to get coach membership notification
   * @param coachMembershipNotification - coach membership notification that will be added
   */
  public addCoachMembershipNotification(url: string, coachMembershipNotification: CoachMembershipNotification):
    Observable<CoachMembershipNotification> {
    return this.http.post<CoachMembershipNotification>(url, coachMembershipNotification, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to update coach membership notification
   * @param coachMembershipNotification - coach membership notification that will be updated
   */
  public updateCoachMembershipNotification(url: string, coachMembershipNotification: CoachMembershipNotification):
    Observable<CoachMembershipNotification> {
    return this.http.put<CoachMembershipNotification>(url, coachMembershipNotification, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to get coach membership notification
   */
  public getCoachMembershipNotification(url: string): Observable<CoachMembershipNotification> {
    return this.http.get<CoachMembershipNotification>(url, httpOptions);
  }
}
