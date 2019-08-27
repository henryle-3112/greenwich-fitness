import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { About } from '@gw-models/core';
import { tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(private http: HttpClient) {
  }

  /** GET: get about by id */
  public getAbout(url): Observable<About> {
    return this.http.get<About>(url, httpOptions);
  }
}
