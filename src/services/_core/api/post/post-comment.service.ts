import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PostComment} from '@gw-models/core';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PostCommentService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get post's comments
   */
  public getPostComments(url: string): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add post's comment
   * @param postComment - post's comment that will be added
   */
  public addPostComment(url: string, postComment: PostComment): Observable<PostComment> {
    return this.http.post<PostComment>(url, postComment, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to update post's comment
   * @param postComment - post's comment that will be updated
   */
  public updatePostComment(url: string, postComment: PostComment): Observable<PostComment> {
    return this.http.put<PostComment>(url, postComment, httpOptions);
  }
}
