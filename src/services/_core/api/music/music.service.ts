import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Music, ResponseMessage} from '@gw-models/core';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})

export class MusicService {

  constructor(private http: HttpClient) {
  }

  /** GET: get musics by page based on keywords */
  public getMusicsByPage(url): Observable<Music[]> {
    return this.http.get<Music[]>(url, httpOptions).pipe(
      tap((musics: Music[]) => console.log(JSON.stringify(musics)))
    );
  }

  /** GET: get all musics */
  public getAllMusics(url): Observable<Music[]> {
    return this.http.get<Music[]>(url, httpOptions).pipe(
      tap((musics: Music[]) => console.log(JSON.stringify(musics)))
    );
  }


  /** GET: get total musics based on keywords */
  public getTotalMusics(url): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(url, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }
}
