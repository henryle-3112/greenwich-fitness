import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';
import {PostRate} from '@gw-models/core';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PostRateService {

  constructor(private http: HttpClient) {
  }

  /** POST: add new post's rate */
  public addPostRate(postRate: PostRate): Observable<PostRate> {
    return this.http.post<PostRate>(`${Config.api}/${Config.apiAddPostRate}`, postRate, httpOptions).pipe(
      tap((insertedPostRate: PostRate) => console.log(JSON.stringify(insertedPostRate)))
    );
  }

  /** GET: get post's rate by user's id and post's id */
  public getPostRateByUserIdAndPostId(userId: number, postId: number): Observable<PostRate> {
    return this.http.get<PostRate>(
      `${Config.api}/${Config.apiGetPostRateByUserIdAndPostId}/${userId}/${postId}`, httpOptions).pipe(
      tap((postRate: PostRate) => console.log(JSON.stringify(postRate)))
    );
  }
}
