import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostRate } from '@gw-models/core';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PostRateService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to add post's rate
   * @param postRate - post's rate that will be added
   */
  public addPostRate(url: string, postRate: PostRate): Observable<PostRate> {
    return this.http.post<PostRate>(url, postRate, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to get post's rate
   */
  public getPostRate(url: string): Observable<PostRate> {
    return this.http.get<PostRate>(url, httpOptions);
  }
}
