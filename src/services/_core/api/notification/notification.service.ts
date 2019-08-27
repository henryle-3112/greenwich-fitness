import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Notification } from '@gw-models/core';
import { Observable } from 'rxjs';

const httpFullOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'body'
};

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to add notification
   * @param notification - notification that will be added
   */
  public addNotification(url: string, notification: Notification) {
    return this.http.post<Notification>(url, notification, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to get notifications
   */
  public getNotifications(url: string): Observable<HttpResponse<Notification[]>> {
    return this.http.get<HttpResponse<Notification[]>>(url, httpFullOptions);
  }
}
