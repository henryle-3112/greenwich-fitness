import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { UserGift } from '@gw-models/core';
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
export class UserGiftService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to add user gift
   * @param userGift - selected user gift
   */
  public addUserGift(url: string, userGift: UserGift): Observable<UserGift> {
    return this.http.post<UserGift>(url, userGift, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to get user's gifts
   */
  public getUserGifts(url): Observable<HttpResponse<UserGift[]>> {
    return this.http.get<HttpResponse<UserGift[]>>(url, httpFullOptions);
  }

  /**
   *
   * @param url - url that will be used to update user's gift
   * @param userGift - user's gift that will be updated
   */
  public updateUserGift(url: string, userGift: UserGift): Observable<UserGift> {
    return this.http.put<UserGift>(url, userGift, httpOptions);
  }
}
