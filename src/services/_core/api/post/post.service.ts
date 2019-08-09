import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Post, ResponseMessage} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {
  }

  /** GET: get all posts */
  public getTopPosts(top: number, categoryId: number, status: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${Config.api}/${Config.apiGetPosts}/${top}/${categoryId}/${status}`, httpOptions).pipe(
      tap((posts: Post[]) => console.log(JSON.stringify(posts)))
    );
  }


  /** GET: get all posts by category include pagination */
  public getPostsByCategoryAndByPage(categoryId: number, page: number, status: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${Config.api}/${Config.apiGetPostsPaging}/${categoryId}/${page}/${status}`, httpOptions).pipe(
      tap((posts: Post[]) => console.log(JSON.stringify(posts)))
    );
  }

  /** GET: get number of posts by category */
  public getNumberOfPostsByCategory(categoryId: number, status: number): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(
      `${Config.api}/${Config.apiGetNumberOfPostsByCategory}/${categoryId}/${status}`, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** GET: get number of posts by searching */
  public getNumberOfSearchingPosts(url): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(url, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** GET: get searching posts by page */
  public getSearchingPostsByPage(url): Observable<Post[]> {
    return this.http.get<Post[]>(url, httpOptions).pipe(
      tap((posts: Post[]) => console.log(JSON.stringify(posts)))
    );
  }
}
