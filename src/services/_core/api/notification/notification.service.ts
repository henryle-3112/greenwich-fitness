import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Notification} from '@gw-models/core';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
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
    return this.http.post<Notification>(url, notification, httpOptions).pipe(
      tap((insertedNotification: Notification) => console.log(insertedNotification))
    );
  }

  /**
   *
   * @param url - url that will be used to get notifications
   */
  public getNotifications(url: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(url, httpOptions).pipe(
      tap((notifications: Notification[]) => console.log(JSON.stringify(notifications)))
    );
  }
}
