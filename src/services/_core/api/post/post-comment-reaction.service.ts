import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostCommentReaction } from '@gw-models/core';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PostCommentReactionService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get reactions of post's comment
   */
  public getPostCommentReactions(url: string): Observable<PostCommentReaction[]> {
    return this.http.get<PostCommentReaction[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add reaction of post's comment
   * @param postCommentReaction - reaction of post's comment that will be added
   */
  public addNewPostCommentReaction(url: string, postCommentReaction: PostCommentReaction): Observable<PostCommentReaction> {
    return this.http.post<PostCommentReaction>(url, postCommentReaction, httpOptions);
  }
}
