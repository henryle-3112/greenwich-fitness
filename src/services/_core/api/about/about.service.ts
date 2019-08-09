import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {About} from '@gw-models/core';
import {tap} from 'rxjs/operators';
import {Config} from '@gw-config/core';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(private http: HttpClient) {
  }

  /** GET: get about by id */
  public getAboutById(id: number): Observable<About> {
    return this.http.get<About>(`${Config.api}/${Config.apiGetAboutContent}/${id}`, httpOptions).pipe(
      tap((about: About) => console.log(JSON.stringify(about)))
    );
  }
}
