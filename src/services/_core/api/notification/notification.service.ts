import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResponseMessage, Notification} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {
  }


  public addNotification(notification: Notification) {
    return this.http.post<Notification>(`${Config.api}/${Config.apiAddNotification}`, notification, httpOptions).pipe(
      tap((insertedNotification: Notification) => console.log(insertedNotification))
    );
  }

  /** GET: get notifications by user profile id and by page */
  public getNotificationsByUserProfileIdAndByPage(
    url: string
  ): Observable<Notification[]> {
    return this.http.get<Notification[]>(url,
      httpOptions).pipe(
      tap((notifications: Notification[]) => console.log(JSON.stringify(notifications)))
    );
  }

  /** GET: get number of notifications by user profile id */
  public getNumberOfNotificationsByUserProfileId(
    url
  ): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(url, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }
}
