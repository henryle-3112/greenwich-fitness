import {Gallery} from '@gw-models/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'body'
};


@Injectable({
  providedIn: 'root'
})

export class GalleryService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get galleries
   */
  public getGalleries(url): Observable<HttpResponse<Gallery[]>> {
    return this.http.get<HttpResponse<Gallery[]>>(url, httpOptions).pipe(
      tap(response => console.log(response))
    );
  }
}
