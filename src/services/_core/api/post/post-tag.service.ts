import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PostTag} from '@gw-models/core';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'body'
};

@Injectable({
  providedIn: 'root'
})
export class PostTagService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get post's tags
   */
  public getPostTags(url: string): Observable<HttpResponse<PostTag[]>> {
    return this.http.get<HttpResponse<PostTag[]>>(url, httpOptions);
  }
}
