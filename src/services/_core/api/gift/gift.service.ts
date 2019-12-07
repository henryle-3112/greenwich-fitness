import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Gift} from '@gw-models';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'body'
};

@Injectable({
  providedIn: 'root'
})
export class GiftService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get gifts
   */
  public getGifts(url): Observable<HttpResponse<Gift[]>> {
    return this.http.get<HttpResponse<Gift[]>>(url, httpOptions);
  }
}
