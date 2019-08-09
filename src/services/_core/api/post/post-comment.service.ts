import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';
import {Post, PostComment} from '@gw-models/core';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PostCommentService {

  constructor(private http: HttpClient) {
  }

  /** POST: get post's comments by post */
  public getPostCommentsByPost(post: Post, status: number): Observable<PostComment[]> {
    return this.http.post<PostComment[]>(`${Config.api}/${Config.apiGetPostComments}/${status}`, post, httpOptions).pipe(
      tap((postComments: PostComment[]) => console.log(JSON.stringify(postComments)))
    );
  }

  /** POST: add new post's comment */
  public addPostComment(postComment: PostComment): Observable<PostComment> {
    return this.http.post<PostComment>(`${Config.api}/${Config.apiAddPostComment}`, postComment, httpOptions).pipe(
      tap((insertedPostComment: PostComment) => console.log(JSON.stringify(insertedPostComment)))
    );
  }
}
