import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Post, PostTag, ResponseMessage, Tag} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PostTagService {

  constructor(private http: HttpClient) {
  }

  /** GET: get all post tag by tag include pagination */
  public getPostTagsByTagIdAndByPage(tagId: number, page: number, status: number): Observable<PostTag[]> {
    return this.http.get<PostTag[]>(`${Config.api}/${Config.apiGetPostTagsPaging}/${tagId}/${page}/${status}`, httpOptions).pipe(
      tap((postTags: PostTag[]) => console.log(JSON.stringify(postTags)))
    );
  }

  /** GET: get number of post tag by tag */
  public getNumberOfPostTagsByTagId(tagId: number, status: number): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(
      `${Config.api}/${Config.apiGetNumberOfPostTagsByTag}/${tagId}/${status}`, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** POST: get tags by post */
  public getTagsByPost(post: Post): Observable<PostTag[]> {
    return this.http.post<PostTag[]>(`${Config.api}/${Config.apiGetTagsByPost}`, post, httpOptions).pipe(
      tap((tags: PostTag[]) => console.log(JSON.stringify(tags)))
    );
  }
}
