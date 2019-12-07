import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Post} from '@gw-models';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'body'
};

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get posts
   */
  public getPosts(url: string): Observable<HttpResponse<Post[]>> {
    return this.http.get<HttpResponse<Post[]>>(url, httpOptions);
  }
}
