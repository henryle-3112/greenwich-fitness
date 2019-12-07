import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Music} from '@gw-models';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'body'
};


@Injectable({
  providedIn: 'root'
})

export class MusicService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get musics
   */
  public getMusics(url): Observable<HttpResponse<Music[]>> {
    return this.http.get<HttpResponse<Music[]>>(url, httpOptions);
  }

}
