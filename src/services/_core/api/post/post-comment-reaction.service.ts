import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';
import {PostComment, PostCommentReaction, ResponseMessage, UserProfile} from '@gw-models/core';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PostCommentReactionService {

  constructor(private http: HttpClient) {
  }

  /** POST: count number of post comment reactions */
  public countNumberOfPostCommentReactions(postComment: PostComment, reactionType: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountPostCommentReaction}/${reactionType}`, postComment, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** POST: get post's comment reaction by user's profile */
  public getPostCommentReactionsByUserProfile(userProfile: UserProfile): Observable<PostCommentReaction[]> {
    return this.http.post<PostCommentReaction[]>(
      `${Config.api}/${Config.apiGetPostCommentReactionsByUserProfile}`, userProfile, httpOptions).pipe(
      tap((postCommentReactions: PostCommentReaction[]) => console.log(JSON.stringify(postCommentReactions)))
    );
  }

  /** POST: add new post's comment reaction */
  public addNewPostCommentReaction(postCommentReaction: PostCommentReaction): Observable<PostCommentReaction> {
    return this.http.post<PostCommentReaction>(
      `${Config.api}/${Config.addAddNewPostCommentReaction}`, postCommentReaction, httpOptions).pipe(
      tap((insertedPostCommentReaction: PostCommentReaction) => console.log(JSON.stringify(insertedPostCommentReaction)))
    );
  }
}
